import { put, list, del } from "@vercel/blob"
import { NextResponse, type NextRequest } from "next/server"

const SERVICES_BLOB_KEY = "admin/services.json"

export interface SubService {
  id: string
  name: string
  price: number
  quantity?: number
}

export interface Service {
  id: string
  name: string
  icon: string
  category: string
  subServices: SubService[]
  createdAt: string
  updatedAt: string
}

async function getStoredServices(): Promise<Service[]> {
  try {
    const { blobs } = await list({ prefix: "admin/services" })
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url)
      const data = await res.json()
      return data.services || []
    }
  } catch {
    // Blob not found or error, return empty
  }
  return []
}

async function saveServices(services: Service[]): Promise<void> {
  await put(SERVICES_BLOB_KEY, JSON.stringify({ services }), {
    access: "public",
    addRandomSuffix: false,
  })
}

// GET: retrieve all services
export async function GET() {
  try {
    const services = await getStoredServices()
    return NextResponse.json({ services })
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve services" }, { status: 500 })
  }
}

// POST: create a new service
export async function POST(request: NextRequest) {
  try {
    const { name, icon, category } = await request.json()

    if (!name || !icon || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const services = await getStoredServices()
    const newService: Service = {
      id: `service-${Date.now()}`,
      name,
      icon,
      category,
      subServices: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    services.push(newService)
    await saveServices(services)

    return NextResponse.json({ success: true, service: newService })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}

// PUT: update a service
export async function PUT(request: NextRequest) {
  try {
    const { id, name, icon, category } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    const services = await getStoredServices()
    const serviceIndex = services.findIndex((s) => s.id === id)

    if (serviceIndex === -1) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    services[serviceIndex] = {
      ...services[serviceIndex],
      ...(name && { name }),
      ...(icon && { icon }),
      ...(category && { category }),
      updatedAt: new Date().toISOString(),
    }

    await saveServices(services)
    return NextResponse.json({ success: true, service: services[serviceIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

// DELETE: delete a service
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    const services = await getStoredServices()
    const filteredServices = services.filter((s) => s.id !== id)

    if (filteredServices.length === services.length) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    await saveServices(filteredServices)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
