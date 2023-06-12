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
    transferFloor: number;

    @Column({ type: 'integer' })
    unitPrice: number;

    @Column({ type: 'integer' })
    priceWithoutParking: number;

    @Column({ type: 'integer' })
    roomNumber: number;

    @Column({ type: 'integer' })
    hallNumber: number;

    @Column({ type: 'integer' })
    bathNumber: number;

    @Column({ type: 'integer' })
    buildingTransferArea: number;

    @Column({ type: 'integer' })
    parkingSpacePrice: number;

    @Column({ type: 'integer' })
    parkingSpaceTransferArea: number;

    @Column({ type: 'integer' })
    price: number;

    @Column({ type: 'integer' })
    landAmount: number;

    @Column({ type: 'integer' })
    buildingAmount: number;

    @Column({ type: 'integer' })
    parkAmount: number;

    @Column({ type: 'integer' })
    buildingType: number;

    @Column({ type: 'integer' })
    floor: number;

    @Column({ type: 'integer' })
    urbanLandUse: number;

    @Column({ type: 'integer' })
    buildingArea: number;

    @Column({ type: 'integer' })
    subBuildingArea: number;

    @Column({ type: 'integer' })
    belconyArea: number;

    @Column({ type: 'integer' })
    landTransferArea: number;

    @Column({ type: 'integer' })
    parkingSpaceType: number;

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