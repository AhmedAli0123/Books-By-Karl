import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Books from "@/data/Books.json";
import { Book } from "@/type/Book";
import Link from "next/link";

export default function BooksTable() {
  return (
    <section className="bg-[#252231] py-6">
    <div className="w-full max-w-4xl mx-auto p-4 ">
      <h2 className="text-2xl text-gray-100 font-semibold mb-4 text-left md:pl-5">
        Books Overview
      </h2>
      <div className="overflow-x-auto rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead className="text-gray-200 w-[40%] text-base font-semibold">
                Name
              </TableHead>
              <TableHead className="text-gray-200 text-base font-semibold">
                Formats Available
              </TableHead>
              <TableHead className="text-gray-200 text-base font-semibold">
                Release Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Books.books.map((book: Book, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-gray-300">
                  <Link href={`/work/${book.slug}`} className="hover:underline">{book.name}</Link>
                </TableCell>
                <TableCell className="text-gray-300">{book.formatsAvailable.join(", ")}</TableCell>
                <TableCell className="text-gray-600">{book.publishedDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </section>
  );
}
