import React from "react";
import "./GuildFightRoomBox.scss";
import { WaitingRoomDTO } from "../../../../common/DTOs/room/waitingRoom.dto";
import { useNavigate } from "react-router-dom";
import useSocketStore from "../../../../common/zustand/socket.zustand";
import { MatchMembersDTO } from "../../../../common/DTOs/room/matchMembers.dto";
import useMemberStore from "../../../../common/zustand/member.zustand";

interface Props {
  roomData: WaitingRoomDTO;
}
const GuildFightRoomBox = (props: Props) => {
  const status: string = props.roomData.status;
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const { member } = useMemberStore();

  const handleJoinRoom = () => {
    const matchMember: MatchMembersDTO = {
      member: member,
      isReady: false,
    };
    socket.emit("joinRoom", {
      roomName: props.roomData.roomName,
      matchMember: matchMember,
    });
    navigate("/fightroom", { state: props.roomData });
  };

  const getStatusColor = () => {
    if (status === "게임중") {
      return "red";
    } else if (status === "대기중") {
      return "green";
    } else {
      return "black";
    }
  };

  return (
    <div className="fight-box" onClick={handleJoinRoom}>
      <div className="match-leader">{props.roomData.roomName} 의방</div>
      <div className="players-count">{props.roomData.memberCount}/5</div>
      <div className="match-status" style={{ color: getStatusColor() }}>
        {status}
      </div>
    </div>
  );
};
export default GuildFightRoomBox;
