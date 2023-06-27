import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  // eslint-disable-next-line prettier/prettier
  constructor(private dbService: PrismaService) { }

  /**
   * Get All Books
   * @returns
   */
  async getBooks(filter: FilterBookDto) {
    const { title, author, category, min_year, max_year } = filter;
    const find = this.dbService.book;

    if (!title && !author && !category && !min_year && !max_year)
      return await find.findMany();

    if (title || author || category || min_year || max_year) {
      return find.findMany({
        where: {
          AND: [
            title ? { title: { contains: title } } : {},
            author ? { author: { contains: author } } : {},
            category ? { category: { contains: category } } : {},
            min_year ? { year: { gte: +min_year } } : {},
            max_year ? { year: { lte: +max_year } } : {},
          ],
        },
      });
    }
  }

  /**
   * Get Book By ID
   * @param id
   * @returns
   */
  async getBookById(id: string) {
    return await this.dbService.book.findUnique({
      where: { id },
    });
  }

  /**
   * Create book data
   * @param data
   */
  async createBook(data: CreateBookDto) {
    return await this.dbService.book.create({
      data: {
        title: data.title,
        author: data.author,
        category: data.category,
        year: +data.year,
      },
    });
  }

  /**
   * Update User
   * @param id
   * @param data
   */
  async updateBook(id: string, data: UpdateBookDto) {
    return await this.dbService.book.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        author: data.author,
        category: data.category,
        year: +data.year,
      },
    });
  }

  /**
   * Delete Book
   * @param id
   * @returns deleted book
   */
  async deleteBook(id: string) {
    try {
      return await this.dbService.book.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      throw new NotFoundException(`Book Id ${id} does not exist`);
    }
  }

  // private books: any[] = [];

  // getBooks(filter: FilterBookDto): any[] {
  //   const { title, author, category, min_year, max_year } = filter;
  //   const books = this.books.filter((book) => {
  //     if (title && book.title != title) return false;
  //     if (author && book.author != author) return false;
  //     if (category && book.category != category) return false;
  //     if (min_year && book.year < min_year) return false;
  //     if (max_year && book.year > max_year) return false;
  //     return true;
  //   });
  //   return books;
  // }

  // getBook(id: string) {
  //   const bookIdx = this.findBookById(id);
  //   return this.books[bookIdx];
  // }

  // createBook(createBookDto: CreateBookDto) {
  //   const { title, author, category, year } = createBookDto;
  //   this.books.push({ id: uuidv4(), title, author, category, year });
  // }

  // updateBook(id: string, updateBookDto: UpdateBookDto) {
  //   const { title, author, category, year } = updateBookDto;
  //   const bookIdx = this.findBookById(id);
  //   this.books[bookIdx].title = title;
  //   this.books[bookIdx].author = author;
  //   this.books[bookIdx].category = category;
  //   this.books[bookIdx].year = year;
  // }

  // findBookById(id: string) {
  //   const bookIdx = this.books.findIndex((book) => book.id === id);
  //   if (bookIdx === -1) {
  //     throw new NotFoundException(`Book with id ${id} is not found!`);
  //   }
  //   return bookIdx;
  // }

  // deleteBook(id: string) {
  //   const bookIdx = this.findBookById(id);
  //   this.books.splice(bookIdx, 1);
  // }
}
