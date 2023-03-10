import React from "react";
import { CiClock2 } from "react-icons/ci";
import { CiCircleQuestion } from "react-icons/ci";
import { BiPhoneCall, BiChevronDown } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { BsFillLockFill, BsHash } from "react-icons/bs";
import {
	BsCaretDownFill,
	BsCaretRightFill,
	BsShieldLock,
} from "react-icons/bs";

import { Workspace } from "../../types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import ChatModule from "../chatModule";

export default function DashBoard(props: any) {
	const [workspace, setWorkspace] = React.useState<any>({
		id: "",
		name: "",
		magicLink: "",
		admins: [],
		channels: [],
		members: [],
	});
	const [user, setUser] = React.useState<any>();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [chatData, setChatData] = React.useState<any>();
	const [isChannelVisible, setIsChannelVisible] =
		React.useState<boolean>(false);
	const [isDirectMessageVisible, setIsDirectMessageVisible] =
		React.useState<boolean>(false);
	const [selectedChat, setSelectedChat] = React.useState<any>({
		name: "general",
		isPrivate: false,
		id: "sVblA0J0WXMePBS3Chy9",
	});

	const fetchData = async () => {
		setIsLoading(true);
		const workSpaceRes = await getDoc(
			doc(db, "workspace-collection", props.workspaceId)
		);
		const userResponse = await getDoc(doc(db, "users", props.userId));
		setUser(userResponse.data());
		setIsLoading(false);
		setWorkspace(workSpaceRes.data());
	};

	React.useEffect(() => {
		fetchData();
	}, [props.workspaceId, props.userId]);

	const fetchChanelData = async () => {
		const res = await getDoc(doc(db, "channels", selectedChat.id));
		console.log("apiCall", res.data());
		setChatData(res.data());
	};

	React.useEffect(() => {
		fetchChanelData();
	}, []);

	if (isLoading) return <div>Loading...</div>;

	console.log("Data: ", chatData);

	return (
		<div className="h-full bg-black text-text_color ">
			<header className="h-[60px] w-[100%] bg-dark_header flex items-center border-b border-border_color ">
				<span className=" w-[100%] flex items-center justify-center">
					<CiClock2 className="text-[1.3rem] mr-[20px] text-white" />
					<input
						placeholder="Search..."
						className="w-[40%] h-[30px] rounded-md bg-[#3e3d42] text-sm pl-4  "
					/>
				</span>
				<span className="absolute right-0  mr-2">
					<div className="flex flex-row items-center gap-4">
						<span>
							<CiCircleQuestion className="text-[30px] text-white" />
						</span>
						<span>
							{user && user.avatar && (
								<img
									className="w-[30px] h-[30px] object-fit rounded-full"
									src={user.avatar}
								/>
							)}
						</span>
					</div>
				</span>
			</header>
			<section className="flex bg-chat_section_color h-[calc(100%-60px)]">
				<span className="flex flex-[0.2] bg-side_nav  min-w-[250px] border-r border-border_color flex-col ">
					<div
						id="workspace-name-container"
						className="h-[60px] w-[100%] flex justify-between items-center px-3 border-b border-border_color"
					>
						<div className="flex flex-row items-center ">
							<span className="text-l font-bold ">{workspace.name}</span>
							<BiChevronDown className="text-2xl font-bold " />
						</div>
						<span className="bg-white text-black text-xl w-[30px] h-[30px] flex justify-center items-center rounded-full">
							<FaEdit className="text-sm" />
						</span>
					</div>
					<div id="channels-container">
						<div
							id="channel-title"
							className="mt-2"
						>
							<div className=" px-3 py-1">
								<div className="mt-[1rem] flex flex-row items-center gap-2">
									<span
										className=" p-[2px] cursor-pointer rounded hover:bg-hover_color "
										onClick={() => setIsChannelVisible(!isChannelVisible)}
									>
										{isChannelVisible ? (
											<BsCaretDownFill />
										) : (
											<BsCaretRightFill />
										)}
									</span>
									<span className="hover:bg-hover_color px-2 rounded cursor-pointer text-sm font-bold flex flex-row items-center">
										Channels
									</span>
								</div>
							</div>
						</div>

						{/* channel list  */}
						{isChannelVisible &&
							workspace.channels.map((channel: any, ind: number) => {
								return (
									<div
										id="channel-title"
										className="mt-2 cursor-pointer  "
										key={ind}
									>
										<div className=" px-3">
											<div
												className="flex flex-row items-center gap-2 py-1 hover:bg-hover_color rounded-md "
												onClick={() => {
													setSelectedChat(channel);
													fetchChanelData();
												}}
											>
												<span className=" p-[2px]  rounded ">
													{channel.isPrivate ? (
														<BsFillLockFill className="text-sm" />
													) : (
														<BsHash className="text-xl" />
													)}
												</span>
												<span className="px-2 rounded  text-sm  ">
													{channel.name}
												</span>
											</div>
										</div>
									</div>
								);
							})}
					</div>

					<div id="direct-message-container">
						<div
							id="direct-message-title"
							className="mt-2"
						>
							<div className=" px-3 py-1">
								<div className="mt-[1rem] flex flex-row items-center gap-2">
									<span
										className=" p-[2px] cursor-pointer rounded hover:bg-hover_color"
										onClick={() =>
											setIsDirectMessageVisible(!isDirectMessageVisible)
										}
									>
										{isDirectMessageVisible ? (
											<BsCaretDownFill />
										) : (
											<BsCaretRightFill />
										)}
									</span>
									<span className="hover:bg-hover_color px-2 rounded cursor-pointer text-sm font-bold flex flex-row">
										Direct Messages
									</span>
								</div>
							</div>
						</div>
					</div>
				</span>

				{/* Chat section */}
				<span className="flex flex-col gap-[2rem] flex-[1] justify-between">
					<header
						id="chat-section-header"
						className="p-[1rem_2rem] w-full h-[60px]  border-b border-border_color w-[100%] flex justify-between items-center"
					>
						<div className="flex flex-row items-center gap-[5px]">
							<span>{selectedChat.name}</span>
							<BiChevronDown />
						</div>
						<span>
							<BiPhoneCall />
						</span>
					</header>

					{chatData && <ChatModule conversations={chatData.conversations} />}
				</span>
			</section>
		</div>
	);
}
