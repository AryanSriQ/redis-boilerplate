import { client } from "@/lib/db";
import Link from "next/link";

const getBooks = async () => {
  const result = client.zRangeWithScores("books", 0, -1);

  const books = await Promise.all(
    result.map((b) => {
      return client.hGetAll(`books:${b.score}`);
    }),
  );

  return books;
};

export default async function Home() {
  const books = await getBooks();
  return (
    <main>
      <nav className="flex justify-between">
        <h1 className="font-bold">Books on Redis!</h1>
        <Link href="/create" className="btn">
          Add a new book
        </Link>
      </nav>

      <p>List of books here.</p>
      {books.map((book) => (
        <div className="card" key={book.title}>
          <h2>{book.title}</h2>
          <p>BY {book.author}</p>
          <p>{book.blurb}</p>
          <p>Rating: {book.rating}</p>
        </div>
      ))}
    </main>
  );
}
