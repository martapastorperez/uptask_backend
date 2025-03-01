import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body,param } from 'express-validator';
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { ProjectExist } from "../middleware/project";
import { TaskExist, hasAuthorization, taskBeLongsToProject } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamControler";
import { NoteController } from "../controllers/NoteController";

const router=Router()

router.use(authenticate)

router.post('/',
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    ProjectController.createProject)

router.get('/',ProjectController.getAllProjects)

router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.getProjectById)

        //ROuter for Task

router.param('projectId',ProjectExist)


router.put('/:projectId',
    param('projectId').isMongoId().withMessage('ID no valido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject)   
    
router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject)




router.post('/:projectId/task',
    hasAuthorization,
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatoria'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es obligatorio'),
    TaskController.createTask
)

router.get('/:projectId/task',
    TaskController.getAllTask
)

router.param('taskId', TaskExist)
router.param('taskId', taskBeLongsToProject)


router.get('/:projectId/task/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/task/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatoria'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es obligatorio'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/task/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/task/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('status').notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)

/**Routes for teams */
router.get('/:projectId/team',
    TeamController.getProjectTeam
)

router.post('/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage('E-mail no valido'),
    handleInputErrors,
    TeamController.findMemberByEmail
)

router.post('/:projectId/team',
    body('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamController.deleteMember
)

/**Routes for notes */
router.post('/:projectId/task/:taskId/notes',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('content').notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/task/:taskId/notes',
    hasAuthorization,
    handleInputErrors,
    NoteController.getTaskNote
)

router.delete('/:projectId/task/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID no valido'),
    hasAuthorization,
    handleInputErrors,
    NoteController.deleteTaskNote
)


export default router