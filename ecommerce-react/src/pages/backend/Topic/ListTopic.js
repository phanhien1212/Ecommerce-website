import { useEffect, useState } from "react";
import TopicService from "../../../service/TopicService";
import { Link } from "react-router-dom";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
const ListTopic = () => {
  const [topics, setTopics] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [sort_order, setSortOrder] = useState(1);
  const [created_by, setCreatedBy] = useState(1);
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    (async () => {
      const result = await TopicService.getList();
      setTopics(result.data);
      setLoad(Date.now());
    })();
  }, [load, topics]);

  const handleStatus = (id) => {
    (async () => {
      const result = await TopicService.updateStatus(id);
      if (result.data.status === true) {
        setLoad(Date.now());
      }
    })();
  };

  const handDelete = (id) => {
    (async () => {
      const result = await TopicService.destroy(id);
      if (result.data.status === true) {
        setLoad(Date.now());
      }
    })();
  };

  const handSubmit = async (event) => {
    event.preventDefault();
    var topic = new FormData();
    topic.append("name", name);
    topic.append("description", description);
    topic.append("status", status);
    topic.append("created_by", created_by);
    topic.append("sort_order", sort_order);
    (async () => {
      const result = await TopicService.store(topic);
      if (result.data.status === true) {
        toast.success("Thêm chủ đề mới thành công!");
        setName("");
      }
    })();
  };
  return (
    <>
      <ToastContainer />
      <div>
        <section className="content-header my-2">
          <h1 className="d-inline">Chủ đề bài viết</h1>
          <hr style={{ border: "none" }} />
        </section>
        <section className="content-body my-2">
          <div className="row">
            <div className="col-md-4">
              <form onSubmit={handSubmit}>
                <div className="mb-3">
                  <label>
                    <strong>Tên chủ đề (*)</strong>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Tên chủ đề"
                  />
                </div>
                <div className="mb-3">
                  <label>
                    <strong>
                      <strong>Mô tả</strong>
                    </strong>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    name="description"
                    rows={6}
                    className="form-control"
                    placeholder="Mô tả"
                    defaultValue={""}
                  />
                </div>
                <div className="mb-3">
                  <label>
                    <strong>Trạng thái</strong>
                  </label>
                  <select
                    name="status"
                    className="form-control"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value={1}>Xuất bản</option>
                    <option value={2}>Chưa xuất bản</option>
                  </select>
                </div>
                <div className="mb-3 text-end">
                  <button
                    className="btn btn-sm btn-success"
                    type="submit"
                    name="THEM"
                  >
                    <i className="fa fa-save" /> Thêm chủ đề
                  </button>
                </div>
              </form>
            </div>
            <div className="col-md-8">
              <table className="table table-bordered mt-3">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: 30 }}>
                      <input type="checkbox" id="checkboxAll" />
                    </th>
                    <th>Tên chủ đề</th>
                    <th>Tên slug</th>
                    <th className="text-center" style={{ width: 30 }}>
                      ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topics &&
                    topics.map((topic, index) => (
                      <tr className="datarow" key={index}>
                        <td>
                          <input type="checkbox" id="checkId" />
                        </td>
                        <td>
                          <div className="name">
                            <Link to="/admin/page">{topic.name}</Link>
                          </div>
                          <div className="function_style">
                            <button
                              onClick={() => handleStatus(topic.id)}
                              className={
                                topic.status === 1
                                  ? " bg-light border-0 px-1 text-success"
                                  : "bg-light border-0 px-1 text-danger"
                              }
                            >
                              {topic.status === 1 ? (
                                <FaToggleOn />
                              ) : (
                                <FaToggleOff />
                              )}
                            </button>
                            <Link
                              to={"/admin/topic/edit/" + topic.id}
                              className="text-primary mx-1"
                            >
                              <i className="fa fa-edit" />
                            </Link>
                            <Link
                              to={"/admin/topic/show/" + topic.id}
                              className="text-info mx-1"
                            >
                              <i className="fa fa-eye" />
                            </Link>
                            <Link
                              onClick={() => handDelete(topic.id)}
                              className="text-danger mx-1"
                            >
                              <i className="fa fa-trash" />
                            </Link>
                          </div>
                        </td>
                        <td>{topic.slug}</td>
                        <td className="text-center"> {topic.id}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ListTopic;
