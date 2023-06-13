import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('apr')
export class Apr {
    @PrimaryColumn({ unique: true })
    id: string;

    @Column({ type: 'timestamp' })
    transactiontime: Date;

    @Column({ type: 'timestamp' })
    completiontime: Date;

    @Column({ type: 'integer' })
    transferfloor: number;

    @Column({ type: 'integer' })
    unitprice: number;

    @Column({ type: 'integer' })
    pricewithoutparking: number;

    @Column({ type: 'integer' })
    roomnumber: number;

    @Column({ type: 'integer' })
    hallnumber: number;

    @Column({ type: 'integer' })
    bathnumber: number;

    @Column({ type: 'integer' })
    buildingtransferarea: number;

    @Column({ type: 'integer' })
    parkingspaceprice: number;

    @Column({ type: 'integer' })
    parkingspacetransferarea: number;

    @Column({ type: 'integer' })
    price: number;

    @Column({ type: 'integer' })
    landamount: number;

    @Column({ type: 'integer' })
    buildingamount: number;

    @Column({ type: 'integer' })
    parkamount: number;

    @Column({ type: 'integer' })
    buildingtype: number;

    @Column({ type: 'integer' })
    floor: number;

    @Column({ type: 'integer' })
    urbanlanduse: number;

    @Column({ type: 'integer' })
    buildingarea: number;

    @Column({ type: 'integer' })
    subbuildingarea: number;

    @Column({ type: 'integer' })
    belconyarea: number;

    @Column({ type: 'integer' })
    landtransferarea: number;

    @Column({ type: 'integer' })
    parkingspacetype: number;

    @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
    coordinate: string;

    @Column({ type: 'float' })
    'yhat-hnn': number;

    @Column({ type: 'float' })
    y_x: number;

    @Column({ type: 'float' })
    'yhat-mlp': number;

    @Column({ type: 'float' })
    y_y: number;

    @Column({ type: 'varchar', length: 255 })
    address: string;
}