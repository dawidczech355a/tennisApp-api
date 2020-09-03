import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Games {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { nullable: false, length: 255 })
  winner: string;

  @Column('date', { nullable: false })
  date: Date;

  @Column('varchar', { nullable: false, length: 255 })
  loser: string;

  @Column('varchar', { nullable: false, length: 255 })
  result: string;
}
