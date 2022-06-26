const Project = require("../models/project")
const JoinedHitory = require("../models/joinedHistory")
const { Op } = require("sequelize")
const Status = require("../../data-type/projectStatus")
const sequelize = require("../connection")
const { getPool } = require("../../../contract/services/server/pool")

require("../reference")

async function getProjects(type, amount = 9999, step = 0) {
    const now = Date.now() / 1000

    let projects
    switch (type) {
        case Status.UPCOMING:
            try {
                projects = await Project.findAll({
                    where: { BeginTime: { [Op.gt]: now } },
                    order: [["BeginTime", "DESC"]],
                    offset: parseInt(step),
                    limit: parseInt(amount),
                })
                return projects
            } catch (error) {
                return { error: error.name }
            }
        case Status.ACTIVE:
            try {
                projects = await Project.findAll({
                    where: {
                        BeginTime: { [Op.lte]: now },
                        EndTime: { [Op.gt]: now },
                    },
                    order: [["EndTime", "DESC"]],
                    offset: parseInt(step),
                    limit: parseInt(amount),
                })
                return projects
            } catch (error) {
                return { error: error.name }
            }
        case Status.ENDED:
            try {
                projects = await Project.findAll({
                    where: { EndTime: { [Op.lt]: now } },
                    order: [["EndTime", "DESC"]],
                    offset: parseInt(step),
                    limit: parseInt(amount),
                })
                return projects
            } catch (error) {
                return error
            }
        default:
            return { error: "Status not exist" }
    }
}

async function getProjectByAddress(address) {
    try {
        const project = await Project.findOne({
            where: { PoolAddress: address },
        })
        return project
    } catch (error) {
        return { error: error.name }
    }
}

async function getProjectById(id) {
    try {
        const projects = await sequelize.query(
            `SELECT * FROM project WHERE LOWER(REPLACE(Name, ' ', '-')) = '${id}'`
        );
        if (projects[0][0].Description != null && projects[0][0].Description != undefined) {
            projects[0][0].Description = projects[0][0].Description.split('\\n').join('<br/>');
            projects[0][0].Description = projects[0][0].Description.split('\n').join('<br/>');
        }

        return projects[0][0];
    } catch (error) {
        return { error: error.name };
    }
}

async function countParticipants(address) {
    try {
        let project = await Project.findOne({ where: { PoolAddress: address } })
        let joinedHistoryList = await project.getJoinedHistoryList()
        return joinedHistoryList.length
    } catch (error) {
        return error
    }
}

async function createProject({
    PoolAddress,
    Name,
    Description,
    Website,
    Whitepaper,
    Twitter,
    IsPublic,
    TokenAddress,
    OwnerAddress,
    LogoUrl,
    BeginTime,
    EndTime,
    MoneyRaise,
}) {
    const [project, created] = await Project.findOrCreate({
        where: { PoolAddress },
        defaults: {
            Name,
            Description,
            Website,
            Whitepaper,
            Twitter,
            IsPublic,
            TokenAddress,
            OwnerAddress,
            LogoUrl,
            BeginTime,
            EndTime,
            MoneyRaise,
        },
    })

    return { project, created }
}

async function updateProject(id, updatedData) {
    try {
        let project = await getProjectById(id)

        if (!project) {
            throw { sqlMessage: "Project not exist" }
        }

        project = await Project.findOne({
            where: { PoolAddress: project.PoolAddress },
        })

        project.update(updatedData)

        const result = await project.save()
        return {
            project: result,
            updated: true,
        }
    } catch (e) {
        console.log(e)
        return {
            updated: false,
            error: e.toString(),
        }
    }
}

async function updateProjectFromPool(id) {
    try {
        let project = await getProjectById(id)

        if (!project) {
            throw { sqlMessage: "Project not exist" }
        }

        project = await Project.findByPk(project.PoolAddress)

        const handler = await getPool(project.PoolAddress, project.ChainId)
        const newInfo = await handler.getInformation()
        project.TokenAddress = newInfo.erc20
        project.BeginTime = newInfo.startDate
        project.EndTime = newInfo.endDate
        project.OwnerAddress = await handler.owner
        project.save()

        return {
            updated: true,
            project
        }
    } catch (e) {
        console.log(e)
        return {
            updated: false,
            error: e.toString(),
        }
    }
}

async function deleteProject(id) {
    try {
        let project = await getProjectById(id)

        if (!project) {
            throw { sqlMessage: "Project not exist" }
        }

        const histories = await JoinedHitory.findAll({
            where: { PoolAddress: project.PoolAddress },
        })

        histories.forEach((history) => history.destroy())

        project = await Project.findOne({
            where: { ...project },
        })

        await project.destroy()

        return {
            deleted: true,
        }
    } catch (error) {
        console.log(error)
        return {
            deleted: false,
            error: error.sqlMessage,
        }
    }
}

async function getProjectsByOwner(OwnerAddress) {
    try {
        let projects = await Project.findAll({ where: { OwnerAddress } })
        return projects
    } catch (error) {
        return {
            error: error.toString(),
        }
    }
}

async function getProjectsByBuyer(UserAddress) {
    try {
        let projects = await JoinedHitory.findAll({ where: { UserAddress } })
        projects = projects.map(async (project) => {
            const pool = await Project.findOne({
                where: { PoolAddress: project.PoolAddress },
            })
            return pool
        })
        projects = await Promise.all(projects)
        return projects
    } catch (error) {
        return {
            error: error.toString(),
        }
    }
}

async function checkPoolExists(id) {
    try {
        let project = await sequelize.query(
            `SELECT Name FROM project WHERE LOWER(REPLACE(Name, ' ', '-')) = '${id}'`
        );
        if (!project[0][0]) {
            return false;
        }
        return true;
    } catch (error) {
        return { error: error.name };
    }
}

async function getAllPoolName() {
    try {
        let projects = await Project.findAll({ attributes: ['Name'] })
        return projects
    } catch (error) {
        return { error: error.name };
    }
}

module.exports = {
    getProjects,
    countParticipants,
    getProjectByAddress,
    getProjectById,
    createProject,
    updateProject,
    updateProjectFromPool,
    deleteProject,
    getProjectsByOwner,
    getProjectsByBuyer,
    checkPoolExists,
    getAllPoolName
}
