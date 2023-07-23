import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Author } from "./Author"

@Entity()
export class Quote {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    content: string

    @ManyToOne(() => Author, (author) => author.quotes)
    author: Author

    @Column()
    generatedAt: Date
}