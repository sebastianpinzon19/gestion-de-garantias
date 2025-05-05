"use client"

import { useState } from "react"
import { useLanguage } from "@/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, Edit, Trash } from "lucide-react"

export default function UsersPage() {
  const { t } = useLanguage()
  const [users, setUsers] = useState([
    { id: 1, name: "Sebastian", email: "sebas@gmail.com", role: "admin" },
    { id: 2, name: "Vendedor", email: "vendedor@gmail.com", role: "seller" },
    { id: 3, name: "Ana Martínez", email: "ana@ejemplo.com", role: "seller" },
    { id: 4, name: "Carlos López", email: "carlos@ejemplo.com", role: "seller" },
    { id: 5, name: "María García", email: "maria@ejemplo.com", role: "seller" },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "seller",
  })

  // En una implementación real, esto sería una llamada a la API
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     setLoading(true)
  //     try {
  //       const response = await fetch("/api/users")
  //       const data = await response.json()
  //       setUsers(data)
  //     } catch (error) {
  //       console.error("Error fetching users:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchUsers()
  // }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingUser) {
      // Actualizar usuario existente
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? { ...user, name: formData.name, email: formData.email, role: formData.role }
            : user,
        ),
      )
    } else {
      // Crear nuevo usuario
      const newUser = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      }
      setUsers((prev) => [...prev, newUser])
    }

    resetForm()
    setOpenDialog(false)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    })
    setOpenDialog(true)
  }

  const handleDelete = (userId) => {
    if (confirm(t("confirmDelete"))) {
      setUsers((prev) => prev.filter((user) => user.id !== userId))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "seller",
    })
    setEditingUser(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("users")}</h2>
          <p className="text-muted-foreground">{t("manageUsers")}</p>
        </div>
        <Dialog
          open={openDialog}
          onOpenChange={(open) => {
            setOpenDialog(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("newUser")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? t("editUser") : t("newUser")}</DialogTitle>
              <DialogDescription>{editingUser ? t("editUserDesc") : t("newUserDesc")}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    {t("name")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    {t("email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                {!editingUser && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      {t("password")}
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="col-span-3"
                      required={!editingUser}
                    />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    {t("role")}
                  </Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t("selectRole")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t("admin")}</SelectItem>
                      <SelectItem value="seller">{t("seller")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingUser ? t("saveChanges") : t("createUser")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("usersList")}</CardTitle>
          <CardDescription>{t("usersListDesc")}</CardDescription>
          <div className="flex items-center mt-4">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input
              placeholder={t("searchUsers")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "admin"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {user.role === "admin" ? t("admin") : t("seller")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    {t("noUsersFound")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
