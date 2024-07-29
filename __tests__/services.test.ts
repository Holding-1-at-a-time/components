import { createMockContext } from 'convex/testing';
import { handler, create, listServices, listByTenant } from './services';

describe('handler', () => {
  it('should return an array of services', async () => {
    const context = createMockContext({ db: { query: jest.fn().mockResolvedValue([]) } });
    const result = await handler(context, {});
    expect(result).toEqual([]);
  });

  it('should throw an error if the query fails', async () => {
    const context = createMockContext({ db: { query: jest.fn().mockRejectedValue(new Error('Database error')) } });
    await expect(handler(context, {})).rejects.toThrow('Database error');
  });
});

describe('create', () => {
  it('creates a new service', async () => {
    const context = createMockContext({ db: { insert: jest.fn().mockResolvedValue({}) } });
    const result = await create(context, { name: 'New Service', description: 'A new service', price: 9.99, tenantId: 'org1' });
    expect(result).toEqual({ name: 'New Service', description: 'A new service', price: 9.99, tenantId: 'org1' });
  });
});

describe('listServices', () => {
  it('returns an empty array when there are no services', async () => {
    const context = createMockContext({ db: { query: jest.fn().mockResolvedValue([]) } });
    const result = await listServices(context, { tenantId: 'org1' });
    expect(result).toEqual([]);
  });

  it('returns services associated with the given tenant ID', async () => {
    const services = [
      { id: 's1', name: 'Service 1', organizationId: 'org1' },
      { id: 's2', name: 'Service 2', organizationId: 'org1' },
      { id: 's3', name: 'Service 3', organizationId: 'org2' },
    ];
    const context = createMockContext({ db: { query: jest.fn().mockResolvedValue(services) } });
    const result = await listServices(context, { tenantId: 'org1' });
    expect(result).toEqual([services[0], services[1]]);
  });

  it('throws an error when the database query fails', async () => {
    const context = createMockContext({ db: { query: jest.fn().mockRejectedValue(new Error('Database error')) } });
    await expect(listServices(context, { tenantId: 'org1' })).rejects.toThrow('Database error');
  });
});

describe('listByTenant', () => {
  it('returns an empty array when there are no services', async () => {
    const context = createMockContext({ db: { query: jest.fn().mockResolvedValue([]) } });
    const result = await listByTenant(context, { tenantId: 'org1' });
    expect(result).toEqual([]);
  });

  it('returns services associated with the given tenant ID', async () => {
    const services = [
      { id: 's1', name: 'Service 1', organizationId: 'org1' },
      { id: 's2', name: 'Service 2', organizationId: 'org1' },
      { id: 's3', name: 'Service 3', organizationId: 'org2' },
    ];
    const context = createMockContext({ db: { query: jest.fn().mockResolvedValue(services) } });
    const result = await listByTenant(context, { tenantId: 'org1' });
    expect(result).toEqual([services[0], services[1]]);
  });

  it('throws an error when the database query fails', async () => {
    const context = createMockContext({ db: { query: jest.fn().mockRejectedValue(new Error('Database error')) } });
    await expect(listByTenant(context, { tenantId: 'org1' })).rejects.toThrow('Database error');
  });
});
import { createMockContext } from 'convex/testing';
import { handler, create, listServices, listByTenant } from './services';

describe('handler', () => {
  it('should return an array of services', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockResolvedValue([]) } });
    const result = await handler(ctx, {});
    expect(result).toEqual([]);
import { createMockContext } from 'convex/testing';
import { setup } from './jest.setup';


// convex\__test__\services.test.ts
describe('handler', () => {
  it('should return an array of services', async () => {
    // Arrange
    const ctx = createTestContext();
    const expectedServices = [{ id: '1', name: 'Service 1' }, { id: '2', name: 'Service 2' }];
    ctx.db.query.mockResolvedValue(expectedServices);

    // Act
    const result = await handler(ctx, {});

    // Assert
    expect(result).toEqual(expectedServices);
    expect(ctx.db.query).toHaveBeenCalledWith('services');
  });

  it('should throw an error if the query fails', async () => {
    // Arrange
    const ctx = createTestContext();
    const expectedError = new Error('Database error');
    ctx.db.query.mockRejectedValue(expectedError);

    // Act and Assert
    await expect(handler(ctx, {})).rejects.toThrow(expectedError);
    expect(ctx.db.query).toHaveBeenCalledWith('services');
  });
});

describe('create', () => {
  test('creates a new service', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockResolvedValue([]) } });
    const result = await create(ctx, { name: 'New Service', description: 'A new service', price: 9.99, tenantId: 'org1' });
    expect(result).toEqual({ name: 'New Service', description: 'A new service', price: 9.99, tenantId: 'org1' });
  });
});

describe('listServices', () => {
  test('returns an empty array when there are no services', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockResolvedValue([]) } });
    const result = await listServices(ctx, { tenantId: 'org1' });
    expect(result).toEqual([]);
  });

  test('returns services associated with the given tenant ID', async () => {
    const services = [
      { id: 's1', name: 'Service 1', organizationId: 'org1' },
      { id: 's2', name: 'Service 2', organizationId: 'org1' },
      { id: 's3', name: 'Service 3', organizationId: 'org2' },
    ];
    const ctx = createMockContext({ db: { query: jest.fn().mockResolvedValue(services) } });
    const result = await listServices(ctx, { tenantId: 'org1' });
    expect(result).toEqual([services[0], services[1]]);
  });

  test('throws an error when the database query fails', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockRejectedValue(new Error('Database error')) } });
    await expect(listServices(ctx, { tenantId: 'org1' })).rejects.toThrow('Database error');
  });
});

describe('listByTenant', () => {
  test('returns an empty array when there are no services', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockResolvedValue([]) } });
    const result = await listByTenant(ctx, { tenantId: 'org1' });
    expect(result).toEqual([]);
  });

  test('returns services associated with the given tenant ID', async () => {
    const services = [
      { id: 's1', name: 'Service 1', organizationId: 'org1' },
      { id: 's2', name: 'Service 2', organizationId: 'org1' },
      { id: 's3', name: 'Service 3', organizationId: 'org2' },
    ];
    const ctx = createMockContext({ db: { query: jest.fn().mockResolvedValue(services) } });
    const result = await listByTenant(ctx, { tenantId: 'org1' });
    expect(result).toEqual([services[0], services[1]]);
  });

  test('throws an error when the database query fails', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockRejectedValue(new Error('Database error')) } });
    await expect(listByTenant(ctx, { tenantId: 'org1' })).rejects.toThrow('Database error');
  });
});
});

describe('handler', () => {
  it('should return an array of services', async () => {
    // Arrange
    const ctx = createTestContext();
    const expectedServices = [{ id: '1', name: 'Service 1' }, { id: '2', name: 'Service 2' }];
    ctx.db.query.mockResolvedValue(expectedServices);

    // Act
    const result = await handler(ctx, {});

    // Assert
    expect(result).toEqual(expectedServices);
    expect(ctx.db.query).toHaveBeenCalledWith('services');
  });

  it('should throw an error if the query fails', async () => {
    // Arrange
    const ctx = createTestContext();
    const expectedError = new Error('Database error');
    ctx.db.query.mockRejectedValue(expectedError);

    // Act and Assert
    await expect(handler(ctx, {})).rejects.toThrow(expectedError);
    expect(ctx.db.query).toHaveBeenCalledWith('services');
  });
});

import { createMockContext } from 'convex/testing';
import { listServices } from './services';

describe('listServices', () => {
  test('returns an empty array when there are no services', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockResolvedValue([]) } });
    const args = { tenantId: 'org1' };
    const result = await listServices(ctx, args);
    expect(result).toEqual([]);
  });

  test('returns services associated with the given tenant ID', async () => {
    const services = [
      { id: 's1', name: 'Service 1', organizationId: 'org1' },
      { id: 's2', name: 'Service 2', organizationId: 'org1' },
      { id: 's3', name: 'Service 3', organizationId: 'org2' },
    ];
    const ctx = createMockContext({ db: { query: jest.fn().mockResolvedValue(services) } });
    const args = { tenantId: 'org1' };
    const result = await listServices(ctx, args);
    expect(result).toEqual([services[0], services[1]]);
  });

  test('throws an error when the database query fails', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockRejectedValue(new Error('Database error')) } });
    const args = { tenantId: 'org1' };
    await expect(listServices(ctx, args)).rejects.toThrow('Database error');
  });
});

describe('handler', () => {
    it('should return an empty array when no services are found', async () => {
      const mockCtx = {
        db: {
          query: jest.fn().mockReturnThis(),
          filter: jest.fn().mockReturnThis(),
          collect: jest.fn().mockResolvedValue([]),
        },
      };
      const result = await handler(mockCtx, { tenantId: '123' });
      expect(result).toEqual([]);
    });
  
    it('should return an array of services when services are found', async () => {
      const mockCtx = {
        db: {
          query: jest.fn().mockReturnThis(),
          filter: jest.fn().mockReturnThis(),
          collect: jest.fn().mockResolvedValue([{ id: '1', name: 'Service 1' }, { id: '2', name: 'Service 2' }]),
        },
      };
      const result = await handler(mockCtx, { tenantId: '123' });
      expect(result).toEqual([{ id: '1', name: 'Service 1' }, { id: '2', name: 'Service 2' }]);
    });
  
    it('should throw an error when the database query fails', async () => {
      const mockCtx = {
        db: {
          query: jest.fn().mockReturnThis(),
          filter: jest.fn().mockReturnThis(),
          collect: jest.fn().mockRejectedValue(new Error('Database error')),
        },
      };
      await expect(handler(mockCtx, { tenantId: '123' })).rejects.toThrow('Database error');
    });
  });

  it('should throw an error if the query fails', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockRejectedValue(new Error('Database error')) } });
    await expect(handler(ctx, {})).rejects.toThrow('Database error');
  });
});

describe('create', () => {
  it('creates a new service', async () => {
    const ctx = createMockContext({ db: { insert: jest.fn().mockResolvedValue({}) } });
    const result = await create(ctx, { name: 'New Service', description: 'A new service', price: 9.99, tenantId: 'org1' });
    expect(result).toEqual({ name: 'New Service', description: 'A new service', price: 9.99, tenantId: 'org1' });
  });
});

describe('listServices', () => {
  it('returns an empty array when there are no services', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockResolvedValue([]) } });
    const result = await listServices(ctx, { tenantId: 'org1' });
    expect(result).toEqual([]);
  });

  it('returns services associated with the given tenant ID', async () => {
    const services = [
      { id: 's1', name: 'Service 1', organizationId: 'org1' },
      { id: 's2', name: 'Service 2', organizationId: 'org1' },
      { id: 's3', name: 'Service 3', organizationId: 'org2' },
    ];
    const ctx = createMockContext({ db: { query: jest.fn().mockResolvedValue(services) } });
    const result = await listServices(ctx, { tenantId: 'org1' });
    expect(result).toEqual([services[0], services[1]]);
  });

  it('throws an error when the database query fails', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockRejectedValue(new Error('Database error')) } });
    await expect(listServices(ctx, { tenantId: 'org1' })).rejects.toThrow('Database error');
  });
});

describe('listByTenant', () => {
  it('returns an empty array when there are no services', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockResolvedValue([]) } });
    const result = await listByTenant(ctx, { tenantId: 'org1' });
    expect(result).toEqual([]);
  });

  it('returns services associated with the given tenant ID', async () => {
    const services = [
      { id: 's1', name: 'Service 1', organizationId: 'org1' },
      { id: 's2', name: 'Service 2', organizationId: 'org1' },
      { id: 's3', name: 'Service 3', organizationId: 'org2' },
    ];
    const ctx = createMockContext({ db: { query: jest.fn().mockResolvedValue(services) } });
    const result = await listByTenant(ctx, { tenantId: 'org1' });
    expect(result).toEqual([services[0], services[1]]);
  });

  it('throws an error when the database query fails', async () => {
    const ctx = createMockContext({ db: { query: jest.fn().mockRejectedValue(new Error('Database error')) } });
    await expect(listByTenant(ctx, { tenantId: 'org1' })).rejects.toThrow('Database error');
  });
});

