import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateItineraryTable1710000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "itineraries",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "name",
                        type: "varchar"
                    },
                    {
                        name: "userId",
                        type: "uuid"
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()"
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "itineraries",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("itineraries");
        if (table) {
            const foreignKey = table.foreignKeys.find(
                fk => fk.columnNames.indexOf("userId") !== -1
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey("itineraries", foreignKey);
            }
        }
        await queryRunner.dropTable("itineraries");
    }
} 