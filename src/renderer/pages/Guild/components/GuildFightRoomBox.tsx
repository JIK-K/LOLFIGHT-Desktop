import React, { useEffect } from "react";
import { WaitingRoomDTO } from "../../../../common/DTOs/room/waitingRoom.dto";
import { useNavigate } from "react-router-dom";
import useSocketStore from "../../../../common/zustand/socket.zustand";
import { MatchMembersDTO } from "../../../../common/DTOs/room/matchMembers.dto";
import useMemberStore from "../../../../common/zustand/member.zustand";
import toast from "react-hot-toast";

interface Props {
  roomData: WaitingRoomDTO;
}
const GuildFightRoomBox = (props: Props) => {
  const status: string = props.roomData.status;
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const { member } = useMemberStore();

  useEffect(() => {
    socket.on("joinRoom", (response: any) => {
      console.log(response);
      if (response === "full") {
        toast.error("방이 모두 찼습니다");
      } else {
        navigate("/fightroom", { state: response });
      }
    });

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      socket.off("joinRoom");
    };
  }, []);

  const handleJoinRoom = () => {
    const matchMember: MatchMembersDTO = {
      member: member,
      isLeader: false,
    };
    if (matchMember.member.memberGame !== null || undefined) {
      socket.emit("joinRoom", {
        roomName: props.roomData.roomName,
        matchMember: matchMember,
      });
    } else {
      toast.error("롤 계정이 등록되어있는 유저만 입장 가능합니다.");
    }

    // navigate("/fightroom", { state: props.roomData });
  };

  const getStatusColor = () => {
    if (status === "게임중") {
      return "red";
    } else if (status === "대기중") {
      return "green";
    } else if (status === "매칭중") {
      return "blue";
    } else {
      return "black";
    }
  };

  return (
    <div className="h-10 flex items-center justify-between p-2 border-b border-gray-700 cursor-pointer" onClick={handleJoinRoom}>
      <div className="match-leader">{props.roomData.roomName} 의방</div>
      <div className="players-count">{props.roomData.memberCount}/5</div>
      <div className="match-status" style={{ color: getStatusColor() }}>
        {status}
      </div>
    </div>
  );
};
export default GuildFightRoomBox;
