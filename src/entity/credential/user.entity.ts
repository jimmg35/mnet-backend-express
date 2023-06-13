import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany, ManyToMany, JoinTable
} from "typeorm"
import { UserSex } from "../../types/rbac"
import { Role } from "./role.entity"

@Entity({ name: 'user' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text', nullable: true })
    alias: string | null

    @Column({ type: 'text', unique: true })
    email: string

    @Column({ type: 'text' })
    password: string

    @Column({ type: 'text', nullable: true })
    phoneNumber: string | null

    @Column({
        type: "enum",
        enum: UserSex
    })
    sex: UserSex

    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt: Date | null

    @Column({ type: 'text' })
    verifyCode: string

    @Column({ type: 'boolean', default: false })
    isVerified: boolean

    @ManyToMany(type => Role, role => role.users)
    @JoinTable()
    roles: Role[]

}
