import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany, JoinTable
} from "typeorm"
import { RoleEnum } from "../../types/rbac"
import { ApiRight } from "./apiright.entity"
import { PageRight } from "./pageright.entity"
import { User } from "./user.entity"

@Entity({ name: 'role' })
export class Role {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text', unique: true })
    name: string

    @Column({
        type: "enum",
        enum: RoleEnum
    })
    code: RoleEnum

    @ManyToMany(type => User, user => user.roles)
    users: User[]

    @ManyToMany(type => ApiRight, apiright => apiright.roles) //設定bi-directional關聯
    @JoinTable()
    apirights: ApiRight[]

    @ManyToMany(type => PageRight, pageRight => pageRight.roles) //設定bi-directional關聯
    @JoinTable()
    pagerights: PageRight[]

}
