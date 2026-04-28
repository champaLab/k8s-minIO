import promisePool from '../../utils/db'

export async function getDashboardService() {
    try {
        const [userStatus]: any = await promisePool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'INACTIVE' THEN 1 ELSE 0 END) as inactive,
                SUM(CASE WHEN status = 'BLOCK' THEN 1 ELSE 0 END) as blocked
            FROM users
        `)

        const [userRoles]: any = await promisePool.query(`
            SELECT role, COUNT(*) as count FROM users GROUP BY role
        `)

        const [phoneStats]: any = await promisePool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'blacklist' THEN 1 ELSE 0 END) as blacklist,
                SUM(CASE WHEN status = 'graylist' THEN 1 ELSE 0 END) as graylist,
                SUM(CASE WHEN status = 'whitelist' THEN 1 ELSE 0 END) as whitelist
            FROM phone_numbers 
            WHERE deletedAt IS NULL
        `)

        return {
            users: {
                total: userStatus[0].total,
                active: userStatus[0].active,
                inactive: userStatus[0].inactive,
                blocked: userStatus[0].blocked,
                roles: userRoles
            },
            phones: {
                total: phoneStats[0].total,
                blacklist: phoneStats[0].blacklist,
                graylist: phoneStats[0].graylist,
                whitelist: phoneStats[0].whitelist
            }
        }
    } catch (error) {
        throw error
    }
}