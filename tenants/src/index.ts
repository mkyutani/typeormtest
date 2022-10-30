import { AppDataSource } from "./data-source"
import { IsNull } from "typeorm"
import { Tenant } from "./entity/Tenant"
import { ServicePath } from "./entity/ServicePath"
import { Category } from "./entity/Category"

const getTenant = async (tenantName: string): Promise<any> => {
    let tenant
    if (!tenantName) {
        tenant = await AppDataSource.getRepository(Tenant)
                .createQueryBuilder('tenant')
                .where('tenant.name IS NULL')
                .getOne()
    } else {
        tenant = await AppDataSource.getRepository(Tenant)
                .createQueryBuilder('tenant')
                .where('tenant.name = :name', { name: tenantName })
                .getOne()
    }
    return tenant
}

const getServicePath = async (tenantName: string, servicePathName: string): Promise<any> => {

    let servicePath

    const tenant = await getTenant(tenantName)
    if (!tenant) {
        servicePath == null
    } else {
        if (!servicePathName) {
            servicePath = await AppDataSource.getRepository(ServicePath)
                                .createQueryBuilder('servicePath')
                                .where('servicePath.name IS NULL')
                                .andWhere('servicePath.tenant = :tenant', { tenant: tenant.id })
                                .getOne()
        } else {
            servicePath = await AppDataSource.getRepository(ServicePath)
                                .createQueryBuilder('servicePath')
                                .where('servicePath.name = :name', { name: servicePathName })
                                .andWhere('servicePath.tenant = :tenant', { tenant: tenant.id })
                                .getOne()
        }
    }

    return servicePath
}

const insertRecords = async (): Promise<any> => {

    const tenant0 = new Tenant()
    tenant0.name = null
    await AppDataSource.manager.save(tenant0)

    const tenant1 = new Tenant()
    tenant1.name = 'turkey'
    await AppDataSource.manager.save(tenant1)

    const tenant2 = new Tenant()
    tenant2.name = 'thrush'
    await AppDataSource.manager.save(tenant2)

    const tenants = await AppDataSource.getRepository(Tenant).createQueryBuilder('tenant').getMany()
    console.log(tenants)

    const servicePath00 = new ServicePath()
    servicePath00.name = null
    servicePath00.tenant = await getTenant(null)
    await AppDataSource.manager.save(servicePath00)

    const servicePath01 = new ServicePath()
    servicePath01.name = '/path-01'
    servicePath01.tenant = await getTenant(null)
    await AppDataSource.manager.save(servicePath01)

    const servicePath02 = new ServicePath()
    servicePath02.name = null
    servicePath02.tenant = await getTenant('turkey')
    await AppDataSource.manager.save(servicePath02)

    const servicePath1 = new ServicePath()
    servicePath1.name = '/penguin'
    servicePath1.tenant = await getTenant('turkey')
    await AppDataSource.manager.save(servicePath1)

    const servicePath2 = new ServicePath()
    servicePath2.name = '/parrot'
    servicePath2.tenant = await getTenant('turkey')
    await AppDataSource.manager.save(servicePath2)

    const servicePath3 = new ServicePath()
    servicePath3.name = '/pigeon'
    servicePath3.tenant = await getTenant('thrush')
    await AppDataSource.manager.save(servicePath3)

    const servicePaths = await AppDataSource.getRepository(ServicePath).createQueryBuilder('servicePath').getMany()
    console.log(servicePaths)

    const category00 = new Category()
    category00.name = 'category-00'
    category00.servicePath = await getServicePath(null, null)
    category00.color = '#432234'
    category00.displayOrder = 99
    category00.enabled = true
    await AppDataSource.manager.save(category00)

    const category01 = new Category()
    category01.name = 'category-01'
    category01.servicePath = await getServicePath(null, '/path-01')
    category01.color = '#3f3f3f'
    category01.displayOrder = 98
    category01.enabled = true
    await AppDataSource.manager.save(category01)

    const category02 = new Category()
    category02.name = 'category-02'
    category02.servicePath = await getServicePath('turkey', null)
    category02.color = '#3f3f3f'
    category02.displayOrder = 97
    category02.enabled = true
    await AppDataSource.manager.save(category02)

    const category1 = new Category()
    category1.name = 'crane'
    category1.servicePath = await getServicePath('turkey', '/penguin')
    category1.color = '#00008b'
    category1.displayOrder = 1
    category1.enabled = true
    await AppDataSource.manager.save(category1)

    const category2 = new Category()
    category2.name = 'canary'
    category2.servicePath = await getServicePath('turkey', '/penguin')
    category2.color = '#a42245'
    category2.displayOrder = 1
    category2.enabled = true
    await AppDataSource.manager.save(category2)

    const category3 = new Category()
    category3.name = 'condor'
    category3.servicePath = await getServicePath('thrush', '/pigeon')
    category3.color = '#65ace4'
    category3.displayOrder = 3
    category3.enabled = true
    await AppDataSource.manager.save(category3)

    const categories = await AppDataSource.getRepository(Category).createQueryBuilder('category').getMany()
    console.log(categories)
}

const getCategories = async (tenantName: string, servicePathName: string): Promise<any> => {

    let categories
    if (!tenantName) {
        if (!servicePathName) {
            categories = await AppDataSource.getRepository(Category)
                              .createQueryBuilder('category')
                              .leftJoinAndSelect('category.servicePath', 'servicePath')
                              .leftJoinAndSelect('servicePath.tenant', 'tenant')
                              .where('servicePath.name IS NULL')
                              .andWhere('tenant.name IS NULL')
                              .getMany()
        } else {
            categories = await AppDataSource.getRepository(Category)
                              .createQueryBuilder('category')
                              .leftJoinAndSelect('category.servicePath', 'servicePath')
                              .leftJoinAndSelect('servicePath.tenant', 'tenant')
                              .where('servicePath.name = :servicePathName', { servicePathName: servicePathName })
                              .andWhere('tenant.name IS NULL')
                              .getMany()
        }
    } else {
        if (!servicePathName) {
            categories = await AppDataSource.getRepository(Category)
                              .createQueryBuilder('category')
                              .leftJoinAndSelect('category.servicePath', 'servicePath')
                              .leftJoinAndSelect('servicePath.tenant', 'tenant')
                              .where('servicePath.name IS NULL')
                              .andWhere('tenant.name = :tenantName', { tenantName: tenantName })
                              .getMany()
        } else {
            categories = await AppDataSource.getRepository(Category)
                              .createQueryBuilder('category')
                              .leftJoinAndSelect('category.servicePath', 'servicePath')
                              .leftJoinAndSelect('servicePath.tenant', 'tenant')
                              .where('servicePath.name = :servicePathName', { servicePathName: servicePathName })
                              .andWhere('tenant.name = :tenantName', { tenantName: tenantName })
                              .getMany()
        }
    }
    return categories
}

const selectCategories = async (tenantName, servicePathName): Promise<any> => {
    console.log('---- ' + tenantName + ' : ' + servicePathName + ' ----')
    const categories = await getCategories(tenantName, servicePathName)
    if (categories.length == 0) {
        console.log('empty')
    } else {
        categories.map((category, index) => {
            console.log(category)
        })
    }
}

AppDataSource.initialize().then(async () => {

    console.log("Insert records...")
    try {
        await insertRecords()
    } catch(e: unknown) {
    }

    console.log("Select categories...")
    await selectCategories('turkey', '/penguin')
    await selectCategories('turkey', null)
    await selectCategories('turtle', null)
    await selectCategories(null, null)

}).catch(error => console.log(error))
