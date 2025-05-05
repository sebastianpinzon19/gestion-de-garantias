"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Traducciones completas
const translations = {
  es: {
    // Navegación
    home: "Inicio",
    dashboard: "Panel de Control",
    warranties: "Garantías",
    newWarranty: "Nueva Garantía",
    pendingWarranties: "Garantías Pendientes",
    history: "Historial",
    users: "Usuarios",
    settings: "Configuración",
    login: "Iniciar Sesión",
    logout: "Cerrar Sesión",

    // Formularios
    customerInfo: "Información del Cliente",
    sellerInfo: "Información del Vendedor",
    equipmentInfo: "Información del Equipo",
    damageInfo: "Información del Daño",
    customerName: "Nombre del Cliente",
    customerPhone: "Teléfono del Cliente",
    ownerName: "Nombre del Dueño",
    ownerPhone: "Teléfono del Dueño",
    address: "Dirección de la Casa",
    brand: "Marca del Equipo",
    model: "Modelo del Equipo",
    serial: "Serial del Equipo",
    purchaseDate: "Fecha de Compra",
    invoiceNumber: "Número de Factura",
    damagedPart: "Parte Dañada",
    damagedPartSerial: "Serial de la Parte Dañada",
    damageDate: "Fecha del Daño",
    damageDescription: "Descripción del Daño",
    customerSignature: "Firma del Cliente",
    sellerSignature: "Firma del Vendedor",
    crediMemo: "Credi Memo",
    replacementPart: "Parte de Reemplazo",
    replacementPartSerial: "Serial de la Parte de Reemplazo",
    managementDate: "Fecha de Gestión",
    warrantyStatus: "Estado de la Garantía",
    technicianObservations: "Observaciones del Técnico",
    resolutionDate: "Fecha de Resolución",
    onlyForSellers: "Esta sección es solo para vendedores",

    // Estados
    pending: "Pendiente",
    approved: "Aprobada",
    rejected: "Rechazada",
    inReview: "En Revisión",

    // Botones
    save: "Guardar",
    saving: "Guardando...",
    cancel: "Cancelar",
    back: "Volver",
    next: "Siguiente",
    submit: "Enviar",
    edit: "Editar",
    delete: "Eliminar",
    generate: "Generar",
    search: "Buscar",
    filter: "Filtrar",
    clear: "Limpiar",
    addUser: "Añadir Usuario",
    selectStatus: "Seleccionar estado",
    noSignature: "No hay firma",

    // Mensajes
    requiredField: "Este campo es obligatorio",
    successSubmit: "¡Solicitud enviada correctamente!",
    errorSubmit: "Error al enviar la solicitud",
    successSave: "Cambios guardados correctamente",
    errorSave: "Error al guardar los cambios",
    confirmDelete: "¿Está seguro de eliminar este elemento?",
    noResults: "No se encontraron resultados",
    loading: "Cargando...",

    // Admin
    createUser: "Crear Usuario",
    editUser: "Editar Usuario",
    userRole: "Rol de Usuario",
    admin: "Administrador",
    seller: "Vendedor",
    email: "Correo Electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    userManagement: "Gestión de Usuarios",
    userList: "Lista de Usuarios",
    systemSettings: "Configuración del Sistema",
    generalSettings: "Configuración General",
    securitySettings: "Configuración de Seguridad",
    notificationSettings: "Configuración de Notificaciones",

    // Otros
    welcome: "Bienvenido",
    warrantySystem: "Sistema de Garantías",
    warrantyManagement: "Gestión de Garantías",
    warrantyDetails: "Detalles de la Garantía",
    generatePDF: "Generar PDF",
    allWarranties: "Todas las garantías",
    filterByStatus: "Filtrar por estado",
    searchPlaceholder: "Buscar por cliente, producto, serial o Credi Memo",
    actions: "Acciones",
    details: "Ver Detalles",
    manage: "Gestionar",
    date: "Fecha",
    status: "Estado",
    id: "ID",
    customer: "Cliente",
    product: "Producto",
    equipment: "Equipo",
    darkMode: "Modo Oscuro",
    lightMode: "Modo Claro",
    totalWarranties: "Total de Garantías",
    pendingWarrantiesCount: "Garantías Pendientes",
    approvedWarranties: "Garantías Aprobadas",
    rejectedWarranties: "Garantías Rechazadas",
    totalUsers: "Total de Usuarios",
    activeUsers: "Usuarios Activos",
    systemUsers: "Usuarios del Sistema",
    userInfo: "Información sobre los usuarios registrados",
    warrantyStats: "Estadísticas de Garantías",
    warrantyDistribution: "Distribución de garantías por estado",
    adminPanel: "Panel de Administración",
    warrantyForm: "Formulario de Garantía",
    completeForm: "Complete el formulario para iniciar el proceso de garantía",
    requiredFields: "Por favor complete todos los campos obligatorios marcados con *",
    continueButton: "Continuar",
    sendRequest: "Enviar Solicitud",
    requestSent: "Solicitud Enviada",
    requestSentDesc: "Su solicitud de garantía ha sido enviada correctamente",
    notificationMessage:
      "Hemos recibido su solicitud y será procesada por nuestro equipo. Le notificaremos cuando haya actualizaciones.",
    returnHome: "Volver al Inicio",
    sellerSection:
      "Esta sección es solo para uso del vendedor. Si usted es cliente, por favor envíe el formulario con la información de la sección anterior.",
    clearSignature: "Limpiar",
    saveSignature: "Guardar Firma",
    signatureInstructions: 'Dibuje su firma en el recuadro y luego haga clic en "Guardar Firma"',
    downloadPDF: "Descargar PDF",
    pdfGenerating: "Generando PDF...",
    pdfReady: "PDF listo para descargar",
    pdfError: "Error al generar el PDF",
    mainFeatures: "Características Principales",
    digitalForm: "Formulario Digital",
    digitalFormDesc: "Reemplace el papeleo con un formulario digital completo para todas sus necesidades de garantía.",
    efficientManagement: "Gestión Eficiente",
    efficientManagementDesc: "Revise, apruebe o rechace solicitudes de garantía desde un panel centralizado.",
    pdfDocumentation: "Documentación PDF",
    pdfDocumentationDesc: "Genere automáticamente documentos PDF con toda la información de la garantía.",
    forCustomers: "Para Clientes",
    forCustomersDesc:
      "Complete el formulario de garantía para su producto y reciba actualizaciones sobre el estado de su solicitud.",
    forSellers: "Para Vendedores",
    forSellersDesc: "Gestione las solicitudes de garantía, actualice su estado y genere documentos PDF.",
    accessDashboard: "Acceder al Panel",
    requestWarranty: "Solicitar Garantía",
    allRightsReserved: "Todos los derechos reservados.",
    recentActivity: "Actividad Reciente",
    latestWarranties: "Últimas solicitudes de garantía",
    quickActions: "Acciones Rápidas",
    quickActionsDesc: "Accesos directos a funciones comunes",
    viewPendingRequests: "Ver solicitudes pendientes",
    createNewRequest: "Crear nueva solicitud",
    viewFullHistory: "Ver historial completo",
    noNewRequests: "No hay solicitudes nuevas",
    allRequestsManaged: "Todas las solicitudes de garantía han sido gestionadas",
    createNewRequestButton: "Crear Nueva Solicitud",
    noResultsFound: "No se encontraron resultados",
    noResultsDesc: "No se encontraron garantías con los filtros aplicados",
    loadingRequests: "Cargando solicitudes...",
    loadingHistory: "Cargando historial...",
    loadingWarrantyDetails: "Cargando datos de la garantía...",
    errorLoadingData: "Error al cargar los datos",
    changesSaved: "Los cambios han sido guardados correctamente",
    returnToWarrantyList: "Volver a la lista de garantías",
    demoCredentials: "Credenciales de demostración:",
    administratorCredentials: "Administrador: admin@ejemplo.com / admin123",
    sellerCredentials: "Vendedor: vendedor@ejemplo.com / vendedor123",
    loginToSystem: "Ingrese sus credenciales para acceder al sistema",
    incorrectCredentials: "Credenciales incorrectas",
    loginError: "Error al iniciar sesión. Intente nuevamente.",
    loggingIn: "Iniciando sesión...",
    language: "es",
  },
  en: {
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    warranties: "Warranties",
    newWarranty: "New Warranty",
    pendingWarranties: "Pending Warranties",
    history: "History",
    users: "Users",
    settings: "Settings",
    login: "Login",
    logout: "Logout",

    // Forms
    customerInfo: "Customer Information",
    sellerInfo: "Seller Information",
    equipmentInfo: "Equipment Information",
    damageInfo: "Damage Information",
    customerName: "Customer Name",
    customerPhone: "Customer Phone",
    ownerName: "Owner Name",
    ownerPhone: "Owner Phone",
    address: "House Address",
    brand: "Equipment Brand",
    model: "Equipment Model",
    serial: "Equipment Serial",
    purchaseDate: "Purchase Date",
    invoiceNumber: "Invoice Number",
    damagedPart: "Damaged Part",
    damagedPartSerial: "Damaged Part Serial",
    damageDate: "Damage Date",
    damageDescription: "Damage Description",
    customerSignature: "Customer Signature",
    sellerSignature: "Seller Signature",
    crediMemo: "Credi Memo",
    replacementPart: "Replacement Part",
    replacementPartSerial: "Replacement Part Serial",
    managementDate: "Management Date",
    warrantyStatus: "Warranty Status",
    technicianObservations: "Technician Observations",
    resolutionDate: "Resolution Date",
    onlyForSellers: "This section is for sellers only",

    // Status
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    inReview: "In Review",

    // Buttons
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    submit: "Submit",
    edit: "Edit",
    delete: "Delete",
    generate: "Generate",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    addUser: "Add User",
    selectStatus: "Select status",
    noSignature: "No signature",

    // Messages
    requiredField: "This field is required",
    successSubmit: "Request submitted successfully!",
    errorSubmit: "Error submitting request",
    successSave: "Changes saved successfully",
    errorSave: "Error saving changes",
    confirmDelete: "Are you sure you want to delete this item?",
    noResults: "No results found",
    loading: "Loading...",

    // Admin
    createUser: "Create User",
    editUser: "Edit User",
    userRole: "User Role",
    admin: "Administrator",
    seller: "Seller",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    userManagement: "User Management",
    userList: "User List",
    systemSettings: "System Settings",
    generalSettings: "General Settings",
    securitySettings: "Security Settings",
    notificationSettings: "Notification Settings",

    // Others
    welcome: "Welcome",
    warrantySystem: "Warranty System",
    warrantyManagement: "Warranty Management",
    warrantyDetails: "Warranty Details",
    generatePDF: "Generate PDF",
    allWarranties: "All warranties",
    filterByStatus: "Filter by status",
    searchPlaceholder: "Search by customer, product, serial or Credi Memo",
    actions: "Actions",
    details: "View Details",
    manage: "Manage",
    date: "Date",
    status: "Status",
    id: "ID",
    customer: "Customer",
    product: "Product",
    equipment: "Equipment",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    totalWarranties: "Total Warranties",
    pendingWarrantiesCount: "Pending Warranties",
    approvedWarranties: "Approved Warranties",
    rejectedWarranties: "Rejected Warranties",
    totalUsers: "Total Users",
    activeUsers: "Active Users",
    systemUsers: "System Users",
    userInfo: "Information about registered users",
    warrantyStats: "Warranty Statistics",
    warrantyDistribution: "Warranty distribution by status",
    adminPanel: "Admin Panel",
    warrantyForm: "Warranty Form",
    completeForm: "Complete the form to start the warranty process",
    requiredFields: "Please complete all required fields marked with *",
    continueButton: "Continue",
    sendRequest: "Send Request",
    requestSent: "Request Sent",
    requestSentDesc: "Your warranty request has been sent successfully",
    notificationMessage:
      "We have received your request and it will be processed by our team. We will notify you when there are updates.",
    returnHome: "Return to Home",
    sellerSection:
      "This section is for seller use only. If you are a customer, please submit the form with the information from the previous section.",
    clearSignature: "Clear",
    saveSignature: "Save Signature",
    signatureInstructions: 'Draw your signature in the box and then click "Save Signature"',
    downloadPDF: "Download PDF",
    pdfGenerating: "Generating PDF...",
    pdfReady: "PDF ready to download",
    pdfError: "Error generating PDF",
    mainFeatures: "Main Features",
    digitalForm: "Digital Form",
    digitalFormDesc: "Replace paperwork with a complete digital form for all your warranty needs.",
    efficientManagement: "Efficient Management",
    efficientManagementDesc: "Review, approve, or reject warranty requests from a centralized dashboard.",
    pdfDocumentation: "PDF Documentation",
    pdfDocumentationDesc: "Automatically generate PDF documents with all warranty information.",
    forCustomers: "For Customers",
    forCustomersDesc: "Complete the warranty form for your product and receive updates on the status of your request.",
    forSellers: "For Sellers",
    forSellersDesc: "Manage warranty requests, update their status, and generate PDF documents.",
    accessDashboard: "Access Dashboard",
    requestWarranty: "Request Warranty",
    allRightsReserved: "All rights reserved.",
    recentActivity: "Recent Activity",
    latestWarranties: "Latest warranty requests",
    quickActions: "Quick Actions",
    quickActionsDesc: "Shortcuts to common functions",
    viewPendingRequests: "View pending requests",
    createNewRequest: "Create new request",
    viewFullHistory: "View full history",
    noNewRequests: "No new requests",
    allRequestsManaged: "All warranty requests have been managed",
    createNewRequestButton: "Create New Request",
    noResultsFound: "No results found",
    noResultsDesc: "No warranties found with the applied filters",
    loadingRequests: "Loading requests...",
    loadingHistory: "Loading history...",
    loadingWarrantyDetails: "Loading warranty details...",
    errorLoadingData: "Error loading data",
    changesSaved: "Changes have been saved successfully",
    returnToWarrantyList: "Return to warranty list",
    demoCredentials: "Demo credentials:",
    administratorCredentials: "Administrator: admin@ejemplo.com / admin123",
    sellerCredentials: "Seller: vendedor@ejemplo.com / vendedor123",
    loginToSystem: "Enter your credentials to access the system",
    incorrectCredentials: "Incorrect credentials",
    loginError: "Login error. Please try again.",
    loggingIn: "Logging in...",
    language: "en",
  },
}

// Crear el contexto con un valor predeterminado
const defaultContextValue = {
  language: "es",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => {
    // Proporcionar una traducción predeterminada incluso antes de que el contexto esté listo
    const defaultLang = "es"
    if (!translations[defaultLang][key]) {
      return key
    }
    return translations[defaultLang][key]
  },
}

const LanguageContext = createContext(defaultContextValue)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("es")
  const [mounted, setMounted] = useState(false)

  // Cargar preferencia de idioma del localStorage al iniciar
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      try {
        const savedLanguage = localStorage.getItem("preferredLanguage") || "es"
        setLanguage(savedLanguage)
      } catch (error) {
        console.error("Error loading language preference:", error)
      }
    }
  }, [])

  // Guardar preferencia de idioma en localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && mounted) {
      try {
        localStorage.setItem("preferredLanguage", language)
      } catch (error) {
        console.error("Error saving language preference:", error)
      }
    }
  }, [language, mounted])

  const t = (key) => {
    if (!translations[language] || !translations[language][key]) {
      // console.warn(`Translation missing for key: ${key} in language: ${language}`)
      return key
    }
    return translations[language][key]
  }

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "es" ? "en" : "es"))
  }

  const contextValue = {
    language,
    setLanguage,
    toggleLanguage,
    t,
  }

  // Evitar problemas de hidratación renderizando solo cuando el componente está montado
  if (!mounted) {
    return <>{children}</>
  }

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    console.error("useLanguage must be used within a LanguageProvider")
    // Devolver un valor predeterminado para evitar errores
    return defaultContextValue
  }
  return context
}
