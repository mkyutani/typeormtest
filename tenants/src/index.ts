import { AppDataSource } from "./data-source"
import { IsNull } from "typeorm"
import { Tenant } from "./entity/Tenant"
import { ServicePath } from "./entity/ServicePath"
import { Category } from "./entity/Category"
import { PointDataset } from "./entity/PointDataset"
import { PointDetail } from "./entity/PointDetail"
import { SurfaceDataset } from "./entity/SurfaceDataset"
import { SurfaceDetail } from "./entity/SurfaceDetail"

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

const getCategory = async (tenantName: string, servicePathName: string, categoryName: string): Promise<any> => {

    const servicePath = await getServicePath(tenantName, servicePathName)

    const category = await AppDataSource.getRepository(Category)
                          .createQueryBuilder('category')
                          .where('category.servicePath = :servicePath', { servicePath: servicePath.id })
                          .andWhere('category.enabled = TRUE')
                          .getOne()

    return category
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

    const pointDataset1 = new PointDataset()
    pointDataset1.id = 1
    pointDataset1.name = 'PointDataset1'
    pointDataset1.color = '#3f3f3f'
    pointDataset1.entityType = 'PointDataset1'
    pointDataset1.coordinatesAttribute = 'location'
    pointDataset1.registerTimeAttribute = 'time'
    pointDataset1.enabled = true
    pointDataset1.category = await getCategory('turkey', '/penguin', 'crane')
    await AppDataSource.manager.save(pointDataset1)
    const pointDetail101 = new PointDetail()
    pointDetail101.id = 101
    pointDetail101.displayOrder = 1
    pointDetail101.itemAttribute = 'location'
    pointDetail101.dataType = 1
    pointDetail101.enabled = true
    pointDetail101.displayTitle = 'location'
    pointDataset1.pointDetails = [ pointDetail101 ]
    pointDetail101.pointDataset = pointDataset1
    await AppDataSource.manager.save(pointDetail101)
    const pointDetail102 = new PointDetail()
    pointDetail102.id = 102
    pointDetail102.displayOrder = 1
    pointDetail102.itemAttribute = 'time'
    pointDetail102.dataType = 1
    pointDetail102.enabled = true
    pointDetail102.displayTitle = 'time'
    pointDataset1.pointDetails = [ pointDetail102 ]
    pointDetail102.pointDataset = pointDataset1
    await AppDataSource.manager.save(pointDetail102)
    const pointDetail103 = new PointDetail()
    pointDetail103.id = 103
    pointDetail103.displayOrder = 1
    pointDetail103.itemAttribute = 'name'
    pointDetail103.dataType = 1
    pointDetail103.enabled = true
    pointDetail103.displayTitle = 'name'
    pointDataset1.pointDetails = [ pointDetail103 ]
    pointDetail103.pointDataset = pointDataset1
    await AppDataSource.manager.save(pointDetail103)

    const pointDataset2 = new PointDataset()
    pointDataset2.id = 2
    pointDataset2.name = 'PointDataset2'
    pointDataset2.color = '#3f3f3f'
    pointDataset2.entityType = 'PointDataset2'
    pointDataset2.coordinatesAttribute = 'location'
    pointDataset2.registerTimeAttribute = 'time'
    pointDataset2.enabled = true
    pointDataset2.category = await getCategory('turkey', null, 'category-02')
    await AppDataSource.manager.save(pointDataset2)
    const pointDetail201 = new PointDetail()
    pointDetail201.id = 201
    pointDetail201.displayOrder = 1
    pointDetail201.itemAttribute = 'location'
    pointDetail201.dataType = 1
    pointDetail201.enabled = true
    pointDetail201.displayTitle = 'location'
    pointDataset2.pointDetails = [ pointDetail201 ]
    pointDetail201.pointDataset = pointDataset2
    await AppDataSource.manager.save(pointDetail201)
    const pointDetail202 = new PointDetail()
    pointDetail202.id = 202
    pointDetail202.displayOrder = 1
    pointDetail202.itemAttribute = 'time'
    pointDetail202.dataType = 1
    pointDetail202.enabled = true
    pointDetail202.displayTitle = 'time'
    pointDataset2.pointDetails = [ pointDetail202 ]
    pointDetail202.pointDataset = pointDataset2
    await AppDataSource.manager.save(pointDetail202)
    const pointDetail203 = new PointDetail()
    pointDetail203.id = 203
    pointDetail203.displayOrder = 1
    pointDetail203.itemAttribute = 'name'
    pointDetail203.dataType = 1
    pointDetail203.enabled = true
    pointDetail203.displayTitle = 'name'
    pointDataset2.pointDetails = [ pointDetail203 ]
    pointDetail203.pointDataset = pointDataset2
    await AppDataSource.manager.save(pointDetail203)

    const pointDataset3 = new PointDataset()
    pointDataset3.id = 3
    pointDataset3.name = 'PointDataset3'
    pointDataset3.color = '#3f3f3f'
    pointDataset3.entityType = 'PointDataset3'
    pointDataset3.coordinatesAttribute = 'location'
    pointDataset3.registerTimeAttribute = 'time'
    pointDataset3.enabled = true
    pointDataset3.category = await getCategory(null, '/path-01', 'category-01')
    await AppDataSource.manager.save(pointDataset3)
    const pointDetail301 = new PointDetail()
    pointDetail301.id = 301
    pointDetail301.displayOrder = 1
    pointDetail301.itemAttribute = 'location'
    pointDetail301.dataType = 1
    pointDetail301.enabled = true
    pointDetail301.displayTitle = 'location'
    pointDataset3.pointDetails = [ pointDetail301 ]
    pointDetail301.pointDataset = pointDataset3
    await AppDataSource.manager.save(pointDetail301)
    const pointDetail302 = new PointDetail()
    pointDetail302.id = 302
    pointDetail302.displayOrder = 1
    pointDetail302.itemAttribute = 'time'
    pointDetail302.dataType = 1
    pointDetail302.enabled = true
    pointDetail302.displayTitle = 'time'
    pointDataset3.pointDetails = [ pointDetail302 ]
    pointDetail302.pointDataset = pointDataset3
    await AppDataSource.manager.save(pointDetail302)
    const pointDetail303 = new PointDetail()
    pointDetail303.id = 303
    pointDetail303.displayOrder = 1
    pointDetail303.itemAttribute = 'name'
    pointDetail303.dataType = 1
    pointDetail303.enabled = true
    pointDetail303.displayTitle = 'name'
    pointDataset3.pointDetails = [ pointDetail303 ]
    pointDetail303.pointDataset = pointDataset3
    await AppDataSource.manager.save(pointDetail303)

    const pointDataset4 = new PointDataset()
    pointDataset4.id = 4
    pointDataset4.name = 'PointDataset4'
    pointDataset4.color = '#3f3f3f'
    pointDataset4.entityType = 'PointDataset4'
    pointDataset4.coordinatesAttribute = 'location'
    pointDataset4.registerTimeAttribute = 'time'
    pointDataset4.enabled = true
    pointDataset4.category = await getCategory(null, null, 'category-00')
    await AppDataSource.manager.save(pointDataset4)
    const pointDetail401 = new PointDetail()
    pointDetail401.id = 401
    pointDetail401.displayOrder = 1
    pointDetail401.itemAttribute = 'location'
    pointDetail401.dataType = 1
    pointDetail401.enabled = true
    pointDetail401.displayTitle = 'location'
    pointDataset4.pointDetails = [ pointDetail401 ]
    pointDetail401.pointDataset = pointDataset4
    await AppDataSource.manager.save(pointDetail401)
    const pointDetail402 = new PointDetail()
    pointDetail402.id = 402
    pointDetail402.displayOrder = 1
    pointDetail402.itemAttribute = 'time'
    pointDetail402.dataType = 1
    pointDetail402.enabled = true
    pointDetail402.displayTitle = 'time'
    pointDataset4.pointDetails = [ pointDetail402 ]
    pointDetail402.pointDataset = pointDataset4
    await AppDataSource.manager.save(pointDetail402)
    const pointDetail403 = new PointDetail()
    pointDetail403.id = 403
    pointDetail403.displayOrder = 1
    pointDetail403.itemAttribute = 'name'
    pointDetail403.dataType = 1
    pointDetail403.enabled = true
    pointDetail403.displayTitle = 'name'
    pointDataset4.pointDetails = [ pointDetail403 ]
    pointDetail403.pointDataset = pointDataset4
    await AppDataSource.manager.save(pointDetail403)

    const pointDataset = await AppDataSource.getRepository(PointDataset).createQueryBuilder('pointDataset').getMany()
    console.log(pointDataset)
    const pointDetail = await AppDataSource.getRepository(PointDetail).createQueryBuilder('pointDetail').getMany()
    console.log(pointDetail)

}

const getCategories = async (tenantName: string, servicePathName: string): Promise<any> => {

    let categories
    if (!tenantName) {
        if (!servicePathName) {
            categories = await AppDataSource.getRepository(Category)
                              .createQueryBuilder('category')
                              .leftJoinAndSelect('category.servicePath', 'servicePath')
                              .leftJoinAndSelect('servicePath.tenant', 'tenant')
                              .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
                              .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset')
                              .where('servicePath.name IS NULL')
                              .andWhere('tenant.name IS NULL')
                              .andWhere('category.enabled = true')
                              .andWhere('pointDataset.enabled = true or surfaceDataset.enabled = true')
                              .getMany()
        } else {
            categories = await AppDataSource.getRepository(Category)
                              .createQueryBuilder('category')
                              .leftJoinAndSelect('category.servicePath', 'servicePath')
                              .leftJoinAndSelect('servicePath.tenant', 'tenant')
                              .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
                              .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset')
                              .where('servicePath.name = :servicePathName', { servicePathName: servicePathName })
                              .andWhere('tenant.name IS NULL')
                              .andWhere('category.enabled = true')
                              .andWhere('pointDataset.enabled = true or surfaceDataset.enabled = true')
                              .getMany()
        }
    } else {
        if (!servicePathName) {
            categories = await AppDataSource.getRepository(Category)
                              .createQueryBuilder('category')
                              .leftJoinAndSelect('category.servicePath', 'servicePath')
                              .leftJoinAndSelect('servicePath.tenant', 'tenant')
                              .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
                              .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset')
                              .where('servicePath.name IS NULL')
                              .andWhere('tenant.name = :tenantName', { tenantName: tenantName })
                              .andWhere('category.enabled = true')
                              .andWhere('pointDataset.enabled = true or surfaceDataset.enabled = true')
                              .getMany()
        } else {
            categories = await AppDataSource.getRepository(Category)
                              .createQueryBuilder('category')
                              .leftJoinAndSelect('category.servicePath', 'servicePath')
                              .leftJoinAndSelect('servicePath.tenant', 'tenant')
                              .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
                              .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset')
                              .where('servicePath.name = :servicePathName', { servicePathName: servicePathName })
                              .andWhere('tenant.name = :tenantName', { tenantName: tenantName })
                              .andWhere('category.enabled = true')
                              .andWhere('pointDataset.enabled = true or surfaceDataset.enabled = true')
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
    await selectCategories(null, '/path-01')
    await selectCategories(null, null)

}).catch(error => console.log(error))
