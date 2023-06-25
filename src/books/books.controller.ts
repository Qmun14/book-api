import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  // private booksService: BooksService;
  // constructor(booksService: BooksService) {
  //   this.booksService = booksService;
  // }

  // eslint-disable-next-line prettier/prettier
  constructor(private booksService: BooksService) { }

  @Get()
  getBooks(
    @Query('title') title: string,
    @Query('author') author: string,
    @Query('category') category: string,
  ) {
    return this.booksService.getBooks(title, author, category);
  }

  @Get('/:id')
  getBook(@Param('id') id: string) {
    return this.booksService.getBook(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBook(@Body() payload: CreateBookDto) {
    console.log(payload);
    return this.booksService.createBook(payload);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateBook(@Param('id') id: string, @Body() payload: UpdateBookDto) {
    return this.booksService.updateBook(id, payload);
  }

  @Delete('/:id')
  deleteBook(@Param('id') id: string) {
    return this.booksService.deleteBook(id);
  }
}
