import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { publishedList } = await req.json();

    if (!publishedList || !Array.isArray(publishedList)) {
      return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "publishedList.json");
    fs.writeFileSync(filePath, JSON.stringify(publishedList, null, 2));

    return NextResponse.json({ message: "Published list saved successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error saving published list:", error);
    return NextResponse.json({ message: "Failed to save published list" }, { status: 500 });
  }
}
