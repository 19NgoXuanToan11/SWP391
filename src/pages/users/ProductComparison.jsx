import React, { useState } from "react";
import { Card, Table, Select, Button, Typography, Image } from "antd";
import { SwapOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

export function ProductComparison() {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const columns = [
    {
      title: "Thông tin",
      dataIndex: "feature",
      key: "feature",
    },
    ...selectedProducts.map((product) => ({
      title: product.name,
      dataIndex: product.id,
      key: product.id,
      render: (text, record) => {
        if (record.feature === "Hình ảnh") {
          return <Image width={100} src={product.image} />;
        }
        if (record.feature === "Giá") {
          return `${product.price.toLocaleString("vi-VN")}đ`;
        }
        return text;
      },
    })),
  ];

  const compareData = [
    { feature: "Hình ảnh" },
    { feature: "Thương hiệu" },
    { feature: "Giá" },
    { feature: "Kết cấu" },
    { feature: "Độ làm sạch" },
    { feature: "Độ ẩm" },
    { feature: "Phù hợp với" },
  ].map((row) => {
    const rowData = { ...row };
    selectedProducts.forEach((product) => {
      if (row.feature === "Thương hiệu") rowData[product.id] = product.brand;
      if (row.feature === "Kết cấu")
        rowData[product.id] = product.compareFeatures.texture;
      if (row.feature === "Độ làm sạch")
        rowData[product.id] = product.compareFeatures.cleansing;
      if (row.feature === "Độ ẩm")
        rowData[product.id] = product.compareFeatures.moisture;
      if (row.feature === "Phù hợp với")
        rowData[product.id] = product.compareFeatures.suitability;
    });
    return rowData;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="shadow-lg rounded-lg">
        <Title level={2} className="text-center mb-6">
          <SwapOutlined className="mr-2" />
          So Sánh Sản Phẩm
        </Title>

        <div className="mb-6">
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Chọn sản phẩm để so sánh"
            onChange={(values) => {
              const products = productDatabase.filter((p) =>
                values.includes(p.id)
              );
              setSelectedProducts(products);
            }}
          >
            {productDatabase.map((product) => (
              <Option key={product.id} value={product.id}>
                {product.name}
              </Option>
            ))}
          </Select>
        </div>

        {selectedProducts.length > 0 && (
          <Table
            columns={columns}
            dataSource={compareData}
            pagination={false}
            bordered
          />
        )}
      </Card>
    </div>
  );
}
