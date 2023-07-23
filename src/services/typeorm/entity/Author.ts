import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Quote } from "./Quote"

@Entity()
export class Author {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @OneToMany(() => Quote, (quote) => quote.author)
    quotes: Quote[]

    @Column()
    generatedAt: Date

}