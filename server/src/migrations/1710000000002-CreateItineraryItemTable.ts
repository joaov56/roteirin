import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateItineraryItemTable1710000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "itinerary_items",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "itineraryId",
                        type: "uuid"
                    },
                    {
                        name: "name",
                        type: "varchar"
                    },
                    {
                        name: "address",
                        type: "varchar"
                    },
                    {
                        name: "description",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "latitude",
                        type: "decimal",
                        precision: 10,
                        scale: 7
                    },
                    {
                        name: "longitude",
                        type: "decimal",
                        precision: 10,
                        scale: 7
                    },
                    {
                        name: "order",
                        type: "int"
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "itinerary_items",
            new TableForeignKey({
                columnNames: ["itineraryId"],
                referencedColumnNames: ["id"],
                referencedTableName: "itineraries",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("itinerary_items");
        if (table) {
            const foreignKey = table.foreignKeys.find(
                fk => fk.columnNames.indexOf("itineraryId") !== -1
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey("itinerary_items", foreignKey);
            }
        }
        await queryRunner.dropTable("itinerary_items");
    }
} 