import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { UUIDValidationPipe } from 'src/pipes/uuid-validation.pipe';

@Controller('books')
export class BooksController {
  // private booksService: BooksService;
  // constructor(booksService: BooksService) {
  //   this.booksService = booksService;
  // }

  // eslint-disable-next-line prettier/prettier
  constructor(private booksService: BooksService) { }

  /**
   * Get Books
   * @returns
   */
  @Get()
  @UsePipes(ValidationPipe)
  async getBooks(@Query() filter: FilterBookDto) {
    return await this.booksService.getBooks(filter);
  }

  /**
   * Get Single Book By ID
   * @param id
   * @returns
   */
  @Get('/:id')
  async getBookById(@Param('id', UUIDValidationPipe) id: string) {
    return await this.booksService.getBookById(id);
  }

  /**
   * Create Book
   * @param data
   * @returns new book data
   */
  @Post()
  @UsePipes(ValidationPipe)
  async createBook(@Body() data: CreateBookDto) {
    return await this.booksService.createBook(data);
  }

  /**
   * Update Book
   * @param id
   * @param body
   * @returns new update book data
   */
  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updateBook(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() body: UpdateBookDto,
  ) {
    return await this.booksService.updateBook(id, body);
  }

  /**
   * Delete Book
   * @param id
   * @returns
   */
  @Delete('/:id')
  async deleteBook(@Param('id', UUIDValidationPipe) id: string) {
    return await this.booksService.deleteBook(id);
  }

  // @Get()
  // @UsePipes(ValidationPipe)
  // getBooks(@Query() filter: FilterBookDto) {
  //   return this.booksService.getBooks(filter);
  // }

  // @Get('/:id')
  // getBook(@Param('id') id: string) {
  //   return this.booksService.getBook(id);
  // }

  // @Post()
  // @UsePipes(ValidationPipe)
  // createBook(@Body() payload: CreateBookDto) {
  //   console.log(payload);
  //   return this.booksService.createBook(payload);
  // }

  // @Put('/:id')
  // @UsePipes(ValidationPipe)
  // updateBook(@Param('id') id: string, @Body() payload: UpdateBookDto) {
  //   return this.booksService.updateBook(id, payload);
  // }

  // @Delete('/:id')
  // deleteBook(@Param('id') id: string) {
  //   return this.booksService.deleteBook(id);
  // }
}
