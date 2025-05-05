import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/tokens'; // Use verifyToken from lib/tokens.js
import bcrypt from 'bcryptjs';
import { writeFile } from 'fs/promises'; // For saving profile picture locally (example)
import path from 'path';

const prisma = new PrismaClient();

// Helper function to get user from token cookie
async function getUserFromTokenCookie() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  // Fetch fresh user data from DB
  return await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      email: true,
      role: true,
      name: true, // Include other fields as needed
      // profilePictureUrl: true,
      // phoneNumber: true,
    },
  });
}

// GET: Fetch current user's profile
export async function GET(request) {
  try {
    const user = await getUserFromTokenCookie();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return user data (already selected without password)
    const userWithoutPassword = user;
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// PUT: Update user profile
export async function PUT(request) {
  try {
    const user = await getUserFromTokenCookie();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name');
    const phoneNumber = formData.get('phoneNumber');
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const profilePictureFile = formData.get('profilePicture');

    const updateData = {
      updatedAt: new Date()
    };

    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber; // Assuming 'phoneNumber' field exists in schema

    // Handle password change
    if (newPassword) {
      console.log('[PROFILE_UPDATE] Attempting password change for user:', user.id);
      if (!currentPassword) {
        console.log('[PROFILE_UPDATE] Error: Current password missing.');
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
      }
      // Fetch the user again to get the latest password hash from DB
      const currentUserData = await prisma.user.findUnique({ where: { id: user.id }, select: { password: true } });
      if (!currentUserData) {
          console.log('[PROFILE_UPDATE] Error: User not found during password validation.');
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      console.log('[PROFILE_UPDATE] Comparing provided current password with DB hash.');
      const isPasswordValid = await bcrypt.compare(currentPassword, currentUserData.password);
      console.log('[PROFILE_UPDATE] Current password valid?:', isPasswordValid);
      if (!isPasswordValid) {
        console.log('[PROFILE_UPDATE] Error: Invalid current password.');
        return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
      }
      if (newPassword.length < 8) {
         console.log('[PROFILE_UPDATE] Error: New password too short.');
         return NextResponse.json({ error: 'New password must be at least 8 characters long' }, { status: 400 });
      }
      console.log('[PROFILE_UPDATE] Hashing new password.');
      updateData.password = await bcrypt.hash(newPassword, 10);
      console.log('[PROFILE_UPDATE] New password hashed. Ready to update DB.');
    }

    // Handle profile picture upload (Example: saving locally)
    if (profilePictureFile && profilePictureFile.size > 0) {
      try {
        const bytes = await profilePictureFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create a unique filename (e.g., userId-timestamp.ext)
        const filename = `${user.id}-${Date.now()}${path.extname(profilePictureFile.name)}`;
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'profiles', filename);
        
        // Ensure directory exists (you might need a more robust way, e.g., using mkdirp)
        await writeFile(uploadPath, buffer);
        
        // Store the public path to the image
        updateData.profilePictureUrl = `/uploads/profiles/${filename}`; // Assuming 'profilePictureUrl' field exists

      } catch (uploadError) {
        console.error('Error uploading profile picture:', uploadError);
        return NextResponse.json({ error: 'Failed to upload profile picture' }, { status: 500 });
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Return updated user data (excluding password)
    const { password, ...userWithoutPassword } = updatedUser; // Keep this if PUT updates password
    // If PUT doesn't update password, select needed fields in prisma.update
    // and return updatedUser directly.
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error('Error updating profile:', error);
    // Handle potential Prisma errors (e.g., unique constraint violation if email were editable)
    if (error.code === 'P2002') { // Example Prisma error code for unique constraint
        return NextResponse.json({ error: 'A user with this identifier already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}