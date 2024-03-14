import { Flex } from "antd";
import React from "react";

interface Props {}

const GuildRoomList = () => {
  return (
    <Flex vertical>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "50px",
          width: "100%",
          border: "1px solid black",
          borderRadius: "5px",
          color: "black",
          gap: "10px",
          padding: "5px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        <p style={{ margin: "0" }}>누구누구님의 방</p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p>1</p>
          <p>/</p>
          <p>5</p>
        </div>
      </div>
    </Flex>
  );
};

export default GuildRoomList;
