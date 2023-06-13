import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany
} from "typeorm"
import { PageRightEnum } from "../../types/rbac"
import { Role } from "./role.entity"

@Entity({ name: "pageright" })
export class PageRight {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'text', unique: true })
    name: string

    @Column({
        type: "enum",
        enum: PageRightEnum
    })
    code: PageRightEnum

    @ManyToMany(type => Role, role => role.pagerights)
    roles: Role[]
}