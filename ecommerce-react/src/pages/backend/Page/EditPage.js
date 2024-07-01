import { useEffect, useState } from "react";
import PageService from "../../../service/PageService";
import { Link, useParams } from "react-router-dom";
import { urlImage } from "../../../config";
import TopicService from "../../../service/TopicService";
import { ToastContainer, toast } from "react-toastify";
const EditPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [topics, setTopics] = useState([]);
  const [status, setStatus] = useState(1);
  const [image, setImage] = useState("");
  const [topic_id, setTopicId] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updated_by, setUpdatedBy] = useState("");
  const [load, setLoad] = useState(Date.now());

  useEffect(() => {
    (async () => {
      const result = await PageService.getById(id);
      const pageData = result.data;
      setTitle(pageData.title);
      setDescription(pageData.description);
      setDetail(pageData.detail);
      setStatus(pageData.status);
      setTopicId(pageData.topic_id);
      setUpdatedBy(pageData.updated_by);
      setImage(pageData.image);
    })();
  }, [id, load]);
  useEffect(() => {
    (async () => {
      const result = await TopicService.getList();
      setTopics(result.data);
    })();
  }, [id, load]);

  const handSubmit = async (event) => {
    event.preventDefault();

    var image = document.getElementById("image");
    var page = new FormData();
    page.append("title", title);
    page.append("description", description);
    page.append("detail", detail);
    page.append("status", status);
    page.append("topic_id", topic_id);
    page.append("updated_by", updated_by);
    page.append("image", image.files.length === 0 ? image : image.files[0]);

    const result = await PageService.update(id, page);
    console.log(result.data); // Log response từ API để kiểm tra lỗi
    toast.success("Chỉnh sửa thành công!");
  };

  const handleImageChange = (e) => {
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };
  return (
    <>
      <ToastContainer />
      <div>
        <form onSubmit={handSubmit}>
          <section className="content-header my-2">
            <h1 className="d-inline">Cập nhật trang đơn</h1>
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    name="title"
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
                    <select
                      name="status"
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value={1}>Xuất bản</option>
                      <option value={2}>Chưa xuất bản</option>
                    </select>
                  </div>
                  <div className="box-body p-2 border-bottom">
                    <p>Chọn chủ đề</p>
                    <select
                      name="topic"
                      className="form-select"
                      value={topic_id}
                      onChange={(e) => setTopicId(e.target.value)}
                    >
                      <option value={0}>Chọn Chủ Đề</option>
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
                    {selectedImage ? (
                      <img
                        style={{ width: 200 }}
                        src={URL.createObjectURL(selectedImage)}
                        alt="PostImage"
                      />
                    ) : (
                      <img
                        style={{ width: 200 }}
                        src={urlImage + "page/" + image}
                        alt="PostImage"
                      />
                    )}
                    <input
                      type="file"
                      id="image"
                      name="image"
                      className="form-control"
                      onChange={(event) => {
                        console.log(event.target.files[0]);
                        setSelectedImage(event.target.files[0]);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>
    </>
  );
};

export default EditPage;
