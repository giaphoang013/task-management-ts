import { Request, Response} from 'express';
import Task from "../models/task.model";
import paginationHelper from '../../../helpper/pagination';
import searchHelper from '../../../helpper/search';

export const index = async (req: Request,res: Response)=> {
    // Find
    interface find {
        deleted: boolean,
        status?: string,
        title?: RegExp
    }
    const find:find = {
        deleted: false,
    }
    if (req.query.status) {
        find.status = req.query.status.toString();
    }

    // Search Helper
    let objectSearch = searchHelper(req.query)
    if(req.query.keyword) {
      find.title = objectSearch.regex;
    }

        // Phân trang
  let initPagination = {
    currentPage: 1,
    limitItems: 3,
    
  };
  const countTasks = await Task.countDocuments(find);
  const objectPagination = paginationHelper(
    initPagination,
    req.query,
    countTasks
  )

  // Hết Phân trang
    // Sort

    const sort = {};
    if(req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue
    }
    // End Sort

    // const tasks = await Task.find(find);

    const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems)
    .skip(objectPagination.skip);;
    res.json(tasks);
}

export const detail = async (req: Request,res: Response)=> {
    const id: string = req.params.id;
    const task = await Task.findOne({
        _id: id,
        deleted: false
    })
    res.json(task);
}

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      const status: string = req.body.status;
  
      await Task.updateOne({
        _id: id
      }, {
        status: status
      });
  
      res.json({
        code: 200,
        message: "Cập nhật trạng thái thành công!"
      });
    } catch (error) {
      // console.log(error);
      res.json({
        code: 400,
        message: "Không tồn tại bản ghi!"
      });
    }
  };


// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    // const { ids, key, value } = req.body;
    const ids: string[] = req.body.ids;
    const key: string = req.body.key;
    const value: string = req.body.value;
    // console.log(ids);
    // console.log(key);
    // console.log(value);
    switch (key) {
      case "status":
        await Task.updateMany({
          _id: { $in: ids }
        }, {
          status: value
        });
        res.json({
          code: 200,
          message: "Đổi trạng thái thành công!"
        });
        break;
      

        case "delete":
          await Task.updateMany({
            _id: { $in: ids }
          }, {
            deleted: true,
            deleteAt: new Date()
          });
          res.json({
            code: 200,
            message: "Xóa thành công!"
          });
          break;
      default:
        res.json({
          code: 400,
          message: `Không tồn tại!`
        });
        break;
    }
    
    
  } catch (error) {

    res.json({
      code: 400,
      message: `Không tồn tại!`
    });
  }
};


// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body);
    const data = await task.save();

    res.json({
      code: 200,
      message: "Tạo công việc thành công!",
      data: data
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi.........",
    });
  }
};

// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const data = req.body;
    await Task.updateOne({
      _id: id
    }, data);
  
    res.json({
      code: 200,
      message: "Cập nhật công việc thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi ..........!"
    });
  }
};


// [PATCH] /api/v1/tasks/delete/:id
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Task.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date()
    });
  
    res.json({
      code: 200,
      message: "Xóa công việc thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi..........!"
    });
  }

};