import { Link } from "react-router-dom";
import PageService from "../../../service/PageService";
import { useEffect, useState } from "react";
import { urlImage } from "../../../config";
import { FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import TopicService from "../../../service/TopicService";
const ListPage = () => {
  const [pages, setPages] = useState([]);

  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    (async () => {
      const result = await PageService.getList();
      setPages(result.data);
      setLoad(Date.now());
    })();
  }, [load, pages]);
  const [topics, setTopics] = useState([]);
  useEffect(() => {
    (async () => {
      const result = await TopicService.getList();
      setTopics(result.data);
      setLoad(Date.now());
    })();
  }, [load, topics]);

  const handDelete = (id) => {
    (async () => {
      const result = await PageService.destroy(id);
      toast.success("Xóa bài viết thành công!");
    })();
  };
  const handleStatus = (id) => {
    (async () => {
      const result = await PageService.updateStatus(id);
      toast.success("Thay đổi trạng thái thành công!");
    })();
  };
  return (
    <div>
      <ToastContainer />
      <section className="content-header my-2 mb-4 mt-3">
        <h1 className="d-inline">Quản lý trang đơn</h1>
        <Link
          to="/admin/page/create"
          className="btn btn-outline-secondary ms-3"
        >
          Thêm trang đơn
        </Link>
      </section>
      <section className="content-body my-2">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="text-center" style={{ width: 30 }}>
                <input type="checkbox" id="checkboxAll" />
              </th>
              <th className="text-center" style={{ width: 130 }}>
                Hình ảnh
              </th>
              <th>Tên trang đơn</th>
              <th>Chủ đề</th>
              <th>slug</th>
              <th className="text-center" style={{ width: 30 }}>
                ID
              </th>
            </tr>
          </thead>
          <tbody>
            {pages &&
              pages.map((page, index) => (
                <tr className="datarow">
                  <td>
                    <input type="checkbox" id="checkId" />
                  </td>
                  <td>
                    <img
                      style={{ height: 130 }}
                      className="img-fluid"
                      src={urlImage + "page/" + page.image}
                      alt="page.jpg"
                    />
                  </td>
                  <td>
                    <div className="name">
                      <Link to={"/admin/page/" + page.id}>{page.title}</Link>
                    </div>
                    <div className="function_style">
                      <button
                        onClick={() => handleStatus(page.id)}
                        className={
                          page.status === 1
                            ? " bg-light border-0 px-1 text-success"
                            : "bg-light border-0 px-1 text-danger"
                        }
                      >
                        {page.status === 1 ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <Link
                        to={"/admin/page/edit/" + page.id}
                        className="text-primary mx-1"
                      >
                        <i className="fa fa-edit" />
                      </Link>
                      <Link
                        to={"/admin/page/" + page.id}
                        className="text-info mx-1"
                      >
                        <i className="fa fa-eye" />
                      </Link>
                      <button
                        type="button"
                        className="text-danger"
                        style={{ border: "none" }}
                        data-bs-toggle="modal"
                        data-bs-target={"#staticBackdrop" + page.id}
                      >
                        <FaTrash />
                      </button>
                      <div
                        className="modal fadein"
                        id={"staticBackdrop" + page.id}
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex={-1}
                        aria-labelledby={"staticBackdropLabel" + page.id}
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id={"staticBackdropLabel" + page.id}
                              >
                                Xóa Bài Viết
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              />
                            </div>
                            <div className="modal-body">
                              <p>Bạn muốn xóa bài viết?</p>
                              <div className="d-flex flex-row mb-3">
                                <div
                                  className="p-2"
                                  style={{ width: 100, height: 100 }}
                                >
                                  {" "}
                                  <img
                                    className="img-fluid"
                                    src={urlImage + "page/" + page.image}
                                    alt="page.jpg"
                                  />
                                </div>
                                <div className="p-2 d-flex align-items-center">
                                  <h5>{page.name}</h5>
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary "
                                data-bs-dismiss="modal"
                              >
                                Hủy
                              </button>
                              <button
                                type="button"
                                id={"buttonDelete" + page.id}
                                className="btn btn-danger "
                                data-bs-dismiss="modal"
                                onClick={() => handDelete(page.id)}
                              >
                                Xác nhận
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {" "}
                    {topics
                      .filter((user) => user.id === page.topic_id)
                      .map((user) => user.name)
                      .join("") || ""}
                  </td>
                  <td>{page.slug}</td>
                  <td className="text-center">{page.id}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ListPage;
