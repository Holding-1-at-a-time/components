import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { create, update, listByOrganization } from "./path_to_your_module";
import { expect } from "chai";
import { describe, it } from "mocha";
import { setup } from './jest.setup';


describe("Vehicle Management", () => {
  it("test_create_vehicle", async () => {
    const ctx = {
      db: {
        insert: async (collection, data) => {
          expect(collection).to.equal("vehicles");
          expect(data).to.include({
            organizationId: "org123",
            clientId: "client123",
            make: "Toyota",
            model: "Camry",
            year: 2020,
            vin: "1HGCM82633A123456",
            color: "Blue",
            licensePlate: "ABC123",
          });
          return "vehicle123";
        },
      },
    };

    const args = {
      organizationId: "org123",
      clientId: "client123",
      make: "Toyota",
      model: "Camry",
      year: 2020,
      vin: "1HGCM82633A123456",
      color: "Blue",
      licensePlate: "ABC123",
      notes: "Test vehicle",
    };

    const vehicleId = await create.handler(ctx, args);
    expect(vehicleId).to.equal("vehicle123");
  });

  it("test_update_vehicle", async () => {
    const ctx = {
      db: {
        patch: async (id, updateFields) => {
          expect(id).to.equal("vehicle123");
          expect(updateFields).to.include({
            make: "Honda",
            model: "Accord",
          });
        },
      },
    };

    const args = {
      id: "vehicle123",
      make: "Honda",
      model: "Accord",
    };

    await update.handler(ctx, args);
  });

  it("test_list_vehicles_by_organization", async () => {
    const ctx = {
      db: {
        query: (collection) => ({
          withIndex: (index, condition) => {
            expect(collection).to.equal("vehicles");
            expect(index).to.equal("by_organization");
            expect(condition).to.be.a("function");
            return {
              search: (index, term) => {
                expect(index).to.equal("search_vehicles");
                expect(term).to.equal("Camry");
                return {
                  collect: async () => [
                    { id: "vehicle123", make: "Toyota", model: "Camry" },
                  ],
                };
              },
              collect: async () => [
                { id: "vehicle123", make: "Toyota", model: "Camry" },
              ],
            };
          },
        }),
      },
    };

    const argsWithSearch = {
      organizationId: "org123",
      search: "Camry",
    };

    const argsWithoutSearch = {
      organizationId: "org123",
    };

    const vehiclesWithSearch = await listByOrganization.handler(ctx, argsWithSearch);
    expect(vehiclesWithSearch).to.deep.equal([
      { id: "vehicle123", make: "Toyota", model: "Camry" },
    ]);

    const vehiclesWithoutSearch = await listByOrganization.handler(ctx, argsWithoutSearch);
    expect(vehiclesWithoutSearch).to.deep.equal([
      { id: "vehicle123", make: "Toyota", model: "Camry" },
    ]);
  });
});