import { NextResponse } from "next/server"
import { collection, getDocs, query, orderBy, limit, startAfter, where, getFirestore } from "firebase/firestore"

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = Number.parseInt(searchParams.get("limit") || "10", 10)
  const search = searchParams.get("search") || ""
  const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate") as string) : null
  const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate") as string) : null

  const db = getFirestore()
  const logsRef = collection(db, "ActivityLogs")

  try {
    let q = query(logsRef, orderBy("timestamp", "desc"))

    if (search) {
      q = query(q, where("adminEmail", ">=", search), where("adminEmail", "<=", search + "\uf8ff"))
    }

    if (startDate) {
      q = query(q, where("timestamp", ">=", startDate))
    }

    if (endDate) {
      q = query(q, where("timestamp", "<=", endDate))
    }

    // Pagination
    if (page > 1) {
      const prevPageSnapshot = await getDocs(query(q, limit((page - 1) * pageSize)))
      const lastVisible = prevPageSnapshot.docs[prevPageSnapshot.docs.length - 1]
      q = query(q, startAfter(lastVisible))
    }

    q = query(q, limit(pageSize))

    const querySnapshot = await getDocs(q)
    const logs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Get total count for pagination
    const totalSnapshot = await getDocs(query(logsRef))
    const totalLogs = totalSnapshot.size
    const totalPages = Math.ceil(totalLogs / pageSize)

    return NextResponse.json({ logs, totalPages })
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

