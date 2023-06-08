import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany
} from "typeorm"
import { ApiRightEnum } from "../../types/rbac"
import { Role } from "./role.entity"

@Entity({ name: "apiright" })
export class ApiRight {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'text', unique: true })
    name: string

    @Column({
        type: "enum",
        enum: ApiRightEnum
    })
    code: ApiRightEnum

    @ManyToMany(type => Role, role => role.apirights)
    roles: Role[]
}