import { urlImage } from "../../../config";
import CategoryService from "../../../service/CategoryService";
import { useEffect, useState } from "react";
const TrashCategory = () => {
    const [categories, setCategories] = useState([]);
    const [load, setLoad] = useState(Date.now());
    useEffect(() => {
        (async () => {
            const result = await CategoryService.getCategoryTrash();
            setCategories(result.data);
            setLoad(Date.now());
        })();
    }, [load]);
    const handDestroy = (id) => {
        (async () =>{
            const result = await CategoryService.destroy(id);
             if(result.data.status === true)
             {
                 setLoad(Date.now());
             }
             })();  
      };

    const handRestore = (id) => {
        (async () => {
           
                const result = await CategoryService.restore(id);
                if (result.data.status === true) {
                   
                    setLoad(Date.now());
                }
        })();
    };
    return (
        <div>
            <section className="content-header my-2">
                <h1 className="d-inline">Thùng rác danh mục</h1>
                <div className="row mt-3 align-items-center">
                    <div className="col-6">
                        <ul className="manager">
                            <li><a href="category_index.html">Tất cả (123)</a></li>
                            <li><a href="#">Xuất bản (12)</a></li>
                            <li><a href="category_trash.html">Rác (12)</a></li>
                        </ul>
                    </div>
                    <div className="col-6 text-end">
                        <input type="text" className="search d-inline" />
                        <button className="d-inline btnsearch">Tìm kiếm</button>
                    </div>
                </div>
                <div className="row mt-1 align-items-center">
                    <div className="col-md-8">
                        <select name className="d-inline me-1">
                            <option value>Hành động</option>
                            <option value>Bỏ vào thùng rác</option>
                        </select>
                        <button className="btnapply">Áp dụng</button>
                        <select name className="d-inline me-1">
                            <option value>Tất cả vị trí</option>
                        </select>
                        <button className="btnfilter">Lọc</button>
                    </div>
                    <div className="col-md-4 text-end">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination pagination-sm justify-content-end">
                                <li className="page-item disabled">
                                    <a className="page-link">«</a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item">
                                    <a className="page-link" href="#">»</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>
            <section className="content-body my-2">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: 30 }}>
                                <input type="checkbox" id="checkboxAll" />
                            </th>
                            <th className="text-center" style={{ width: 90 }}>Hình ảnh</th>
                            <th>Tên danh mục</th>
                            <th>Tên slug</th>
                        </tr>
                    </thead>
                    <tbody>
                    {categories && categories.map((category,index ) => (
                        <tr className="datarow">
                            <td className="text-center">
                                <input type="checkbox" id="checkId" />
                            </td>
                            <td>
                                <img src={urlImage + "category/" + category.image} alt="category.jpg" />
                            </td>
                            <td>
                                <div className="name">
                                    <a href="category_index.html">
                                    {category.name}
                                    </a>
                                </div>
                                <div className="function_style">
                                    <a href="" className="text-primary mx-1" onClick={() => handRestore(category.id)}>
                                        <i className="fa fa-undo" />
                                    </a>
                                    <a href="" className="text-danger mx-1" onClick={() => handDestroy(category.id)}>
                                        <i className="fa fa-trash" />
                                    </a>
                                </div>
                            </td>
                            <td>{category.slug}</td>
                        </tr>
                         ))}
                    </tbody>
                </table>
            </section>
        </div>

    );
}

export default TrashCategory;