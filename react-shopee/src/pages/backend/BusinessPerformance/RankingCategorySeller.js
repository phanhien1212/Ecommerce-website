import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryService from "../../../service/CategoryService";
import ProductService from "../../../service/ProductService";

const RankingCategorySeller = () => {
  const [category_id, setCategory_id] = useState(0);
  const [load, setLoad] = useState(Date.now());
  const [categories, setCategories] = useState([]);
  const [ranks, setRanks] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await CategoryService.getList();
      setCategories(result.data);
    })();
  }, []);

  useEffect(() => {
    if (category_id > 0) {
      ArrRank();
    }
  }, []);

  const ArrRank = async () => {
    try {
      const result = await ProductService.arrRank(category_id);
      setRanks(result.data);
      setLoad(Date.now());
    } catch (error) {
      console.error("Lỗi xếp hạng sản phẩm:", error);
    }
  };
  return (
    <div className="content">
      <section className="content-header my-2">
        <h1 className="d-inline"> Xếp hạng nhà bán hàng theo danh mục</h1>
        <div className="row mt-3 align-items-center">
          <div className="col-6"></div>
          
        </div>
      </section>
      <section className="content-body my-2">
        <div className="row">
          <div className="col-md-3">
            <ul className="list-group">
              <li className="list-group-item mt-3">
                <h5>Chọn danh mục</h5>
              </li>
              <li className="list-group-item mb-2">
                <div
                  className="p-2 "
                  name="DanhMucCha"
                  style={{ width: 262.4, height: 44 }}
                >
                  <select
                    className="form-select border small"
                    aria-label="Default select example"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      fontSize: 14,
                      marginTop: -4,
                      height: 37.6,
                    }}
                    value={category_id}
                    onChange={(e) => setCategory_id(e.target.value)}
                  >
                    {categories
                      .filter((cat) => cat.parent_id === 0)
                      .map((cat) => (
                        <option
                          key={cat.id}
                          style={{
                            fontSize: 14,
                            height: 37.6,
                          }}
                          value={cat.id}
                        >
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
              </li>
            </ul>
            <button
              type="button"
              class="btn btn-info text-light"
              onClick={() => ArrRank()}
              style={{ width: 100 }}
            >
              Xếp hạng
            </button>
          </div>
          <div className="col-md-9">
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: 30 }}>
                    <input type="checkbox" id="checkboxAll" />
                  </th>
                  <th style={{ width: 100 }}>Xếp hạng</th>
                  <th style={{ width: 400 }}>Nhà bán hàng</th>

                  <th>Số điểm</th>
                </tr>
              </thead>
              <tbody>
                {ranks.map((rank, index) => (
                  <tr className="datarow" key={rank.id}>
                    <td className="text-center">
                      <input type="checkbox" id={`checkId${rank.id}`} />
                    </td>
                    <td>{index + 1}</td> {/* Thứ hạng từ 1 */}
                    <td>{rank.sellerName}</td> {/* Tên nhà bán hàng */}
                    {/* Tên danh mục */}
                    <td className="text-center">{rank.totalScore}</td>{" "}
                    {/* Điểm số của nhà bán hàng */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RankingCategorySeller;
