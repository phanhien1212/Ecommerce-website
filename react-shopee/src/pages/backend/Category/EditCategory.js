import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CategoryService from "../../../service/CategoryService";
import { urlImage } from "../../../config";
import { ToastContainer, toast } from "react-toastify";
const EditCategory = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState(1);
  const [parent_id, setParentId] = useState("");
  const [sort_order, setSortOrder] = useState(1);
  const [updated_by, setUpdatedBy] = useState("");
  const [load, setLoad] = useState(Date.now());

  useEffect(() => {
    (async () => {
      const result = await CategoryService.getById(id);
      const categoryData = result.data;
      const resultCategory = await CategoryService.getCategory();
      setCategories(resultCategory.data);
      setName(categoryData.name);
      setParentId(categoryData.parent_id);
      setSlug(categoryData.slug);
      setUpdatedBy(categoryData.updated_by);
      setDescription(categoryData.description);
      setStatus(categoryData.status);
      setImageUrl(`${urlImage}category/${categoryData.image}`);
    })();
  }, [id, load]);

  const handSubmit = async (event) => {
    event.preventDefault();

    var image = document.getElementById("image");
    var category = new FormData();
    category.append("name", name);
    category.append("description", description);
    category.append("status", status);
    category.append("updated_by", updated_by);
    category.append("parent_id", parent_id);
    category.append("sort_order", sort_order);
    category.append("image", image.files.length === 0 ? "" : image.files[0]);

    const result = await CategoryService.update(id, category);
    console.log(result.data); // Log response từ API để kiểm tra lỗi
    toast.success("Chỉnh sửa danh mục thành công!");
  };

  const handleImageChange = (e) => {
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };
  return (
    <div>
      <ToastContainer />
      <section className="content-header my-2">
        <h1 className="d-inline">Cập nhật danh mục</h1>
        <div className="text-end">
          <a href="category_index.html">Về danh sách</a>
        </div>
      </section>
      <section className="content-body my-2">
        <form onSubmit={handSubmit}>
          <div className="row">
            <div className="col-md-9">
              <div className="mb-3">
                <label>
                  <strong>Tên danh mục (*)</strong>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                  id="name"
                  placeholder="Nhập tên danh mục"
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>Slug</strong>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  name="slug"
                  id="slug"
                  placeholder="Nhập slug"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>Mô tả</strong>
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={7}
                  className="form-control"
                  placeholder="Nhập mô tả"
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
                  <select name="status" className="form-control">
                    <option value={1}>Xuất bản</option>
                    <option value={2}>Chưa xuất bản</option>
                  </select>
                </div>
                <div className="box-footer text-end px-2 py-3">
                  <button
                    type="submit"
                    className="btn btn-success btn-sm text-end"
                  >
                    <i className="fa fa-save" aria-hidden="true" /> Câp nhật
                  </button>
                </div>
              </div>
              <div className="box-container mt-4 bg-white">
                <div className="box-header py-1 px-2 border-bottom">
                  <strong>Danh mục cha (*)</strong>
                </div>
                <div className="box-body p-2">
                  <select
                    name="parent_id"
                    className="form-select"
                    value={parent_id}
                    onChange={(e) => setParentId(e.target.value)}
                  >
                    <option value={0}>Chọn danh mục</option>
                    {categories
                      .filter((category) => category.parent_id === 0)
                      .map((filteredCategory) => (
                        <option
                          key={filteredCategory.id}
                          value={filteredCategory.id}
                        >
                          {filteredCategory.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="box-container mt-4 bg-white">
                <div className="box-header py-1 px-2 border-bottom">
                  <strong>Hình (*)</strong>
                </div>
                <div className="box-body p-2 border-bottom">
                  <input
                    type="file"
                    id="image"
                    onChange={handleImageChange}
                    className="form-control"
                  />
                  <div style={{ width: 200 }}>
                    {imageUrl && <img src={imageUrl} alt="CategoryImage" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditCategory;
