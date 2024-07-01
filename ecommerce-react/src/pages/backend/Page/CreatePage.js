import { useEffect, useState } from "react";
import { urlImage } from "../../../config";
import PageService from "../../../service/PageService";
import TopicService from "../../../service/TopicService";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
const CreatePage = () => {
  const [pages, setPages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [created_by, setCreatedBy] = useState(1);
  const [topic_id, setTopicId] = useState(1);
  const [status, setStatus] = useState(1);
  const [topics, setTopics] = useState([]);
  const [load, setLoad] = useState(Date.now());

  const handleSubmit = async (event) => {
    event.preventDefault();
    const image = document.getElementById("image");

    console.log("e", image.files);

    const page = new FormData();
    page.append("title", title);
    page.append("detail", detail);
    page.append("description", description);
    page.append("status", status);
    page.append("created_by", created_by);
    page.append("topic_id", topic_id);

    // Chỉ thêm tệp nếu có tệp được chọn
    if (image.files.length > 0) {
      page.append("image", image.files[0]);
    }

    try {
      const result = await PageService.store(page);
      toast.success("Thêm bài viết mới thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm bài viết mới");
      console.error("Error storing page:", error);
    }
  };
  useEffect(() => {
    (async () => {
      const result = await TopicService.getList();
      setTopics(result.data);
    })();
  }, []);
  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <section className="content-header my-2">
          <h1 className="d-inline">Thêm trang đơn</h1>
          <div className="text-end">
            <Link to="/admin/page" className="btn btn-sm btn-success">
              <i className="fa fa-arrow-left" /> Về danh sách
            </Link>
          </div>
        </section>
        <section className="content-body my-2">
          <div className="row">
            <div className="col-md-9">
              <div className="mb-3">
                <label>
                  <strong>Tiêu đề bài viết (*)</strong>
                </label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-control"
                  placeholder="Nhập tiêu đề"
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>Chi tiết (*)</strong>
                </label>
                <textarea
                  name="detail"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={7}
                  className="form-control"
                  placeholder="Nhập chi tiết"
                  defaultValue={""}
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>Mô tả (*)</strong>
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="form-control"
                  placeholder="Mô tả"
                  defaultValue={""}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="box-container mt-4 bg-white">
                <div className="box-header py-1 px-2 border-bottom">
                  <strong>Đăng</strong>
                </div>
                <div className="box-body p-2 border-bottom">
                  <p>Chọn trạng thái đăng</p>
                  <select name="status" className="form-select">
                    <option value={1}>Xuất bản</option>
                    <option value={2}>Chưa xuất bản</option>
                  </select>
                  <p>Chọn chủ đề</p>
                  <select
                    value={topic_id}
                    onChange={(e) => setTopicId(e.target.value)}
                    name="topic_id"
                    className="form-select"
                  >
                    <option value={0}>Chọn chủ đề</option>
                    {topics &&
                      topics.map((topic, index) => (
                        <option value={topic.id}>{topic.name}</option>
                      ))}
                  </select>
                </div>
                <div className="box-footer text-end px-2 py-3">
                  <button
                    type="submit"
                    className="btn btn-success btn-sm text-end"
                  >
                    <i className="fa fa-save" aria-hidden="true" /> Đăng
                  </button>
                </div>
              </div>
              <div className="box-container mt-2 bg-white">
                <div className="box-header py-1 px-2 border-bottom">
                  <strong>Hình đại diện</strong>
                </div>
                <div className="box-body p-2 border-bottom">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default CreatePage;
