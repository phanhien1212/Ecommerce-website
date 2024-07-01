import { useEffect, useState } from "react";
import PageService from "../../../service/PageService";
import { Link, useParams } from "react-router-dom";
import { urlImage } from "../../../config";
import { toast } from "react-toastify";
import TopicService from "../../../service/TopicService";
const ShowPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await PageService.getById(parseInt(id, 10));
      setPage(result.data);
    })();
  }, [id]);
  const handDelete = (id) => {
    (async () => {
  await PageService.destroy(id);
      toast.success("Xóa bài viết thành công!");
    })();
  };
  const [topics, setTopics] = useState([]);
  useEffect(() => {
    (async () => {
      const result = await TopicService.getList();
      setTopics(result.data);
    })();
  }, [topics]);
  return (
    <div>
      <section className="content-header my-2">
        <h1 className="d-inline">Chi tiết</h1>
        <div className="row mt-2 align-items-center">
          <div className="col-md-12 text-end">
            <Link to="/admin/page" className="btn btn-primary btn-sm me-2">
              <i className="fa fa-arrow-left" /> Về Danh Sách
            </Link>
            <Link
              to={"/admin/page/edit/" + page.id}
              className="btn btn-success btn-sm me-2"
            >
              <i className="fa fa-edit" /> Chỉnh Sửa
            </Link>
            {/* Button trigger modal */}
            <button
              type="button"
              className="btn btn-danger btn-sm"
              data-bs-toggle="modal"
              data-bs-target={"#staticBackdrop" + page.id}
            >
              Xóa Danh Mục
            </button>
            {/* Modal */}
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
                      <div className="p-2" style={{ width: 100, height: 100 }}>
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
        </div>
      </section>
      <section className="content-body my-2">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: 180 }}>Tên trường</th>
              <th>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {page && (
              <tr>
                <td>ID</td>
                <td>{page.id}</td>
              </tr>
            )}
            {page && (
              <tr>
                <td>Tiêu Đề</td>
                <td>{page.title}</td>
              </tr>
            )}
            {page && (
              <tr>
                <td>Chủ Đề</td>
                <td>
                  {" "}
                  {topics
                    .filter((user) => user.id === page.topic_id)
                    .map((user) => user.name)
                    .join("") || ""}
                </td>
              </tr>
            )}
            {page && (
              <tr>
                <td>Hình Ảnh</td>
                <td>
                  <img
                    className="img-fluid"
                    style={{ width: 100, height: 100 }}
                    src={urlImage + "page/" + page.image}
                    alt={page.image}
                  />
                </td>
              </tr>
            )}
            {page && (
              <tr>
                <td>Mô Tả</td>
                <td>{page.description}</td>
              </tr>
            )}
            {page && (
              <tr>
                <td>Chi Tiết</td>
                <td>{page.detail}</td>
              </tr>
            )}
            <tr>
              <td>Trạng Thái</td>
              <td>{page.status === 0 ? "Đã Ẩn" : "Đã Hiện"}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ShowPage;
