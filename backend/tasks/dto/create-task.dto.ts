import { IsString, IsNotEmpty, IsOptional, IsDateString, isNotEmpty, isDateString, IsNumber } from "class-validator";
export class CreateTaskDto {
@IsString()
@IsNotEmpty()
title: string;

@IsOptional()
@IsDateString()
duedate?: string;

@IsOptional()
@IsNumber()
position?: number;

}
