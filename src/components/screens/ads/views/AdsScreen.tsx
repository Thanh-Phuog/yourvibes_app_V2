import { ActivityIndicator, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, FlatList, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import useColor from '@/src/hooks/useColor';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import Post from '@/src/components/common/Post';
import MyDateTimePicker from '@/src/components/foundation/MyDateTimePicker';
import { useAuth } from '@/src/context/auth/useAuth';
import AdsViewModel from '../viewModel/AdsViewModel';
import { defaultPostRepo } from '@/src/api/features/post/PostRepo';
import { Button } from '@ant-design/react-native';
import { DateTransfer, getDayDiff } from '@/src/utils/helper/DateTransfer';
import { CurrencyFormat } from '@/src/utils/helper/CurrencyFormat';
import dayjs from 'dayjs';
import { AdsCalculate } from '@/src/utils/helper/AdsCalculate';
import * as Linking from "expo-linking";
import Toast from 'react-native-toast-message';

const Ads = ({ postId }: { postId: string }) => {
	const price = 30000;
	const { brandPrimary, backgroundColor } = useColor();
	const [method, setMethod] = useState("momo");
	const [showDatePicker, setShowDatePicker] = useState(false);
	const { language, localStrings } = useAuth();
	const [diffDay, setDiffDay] = useState(1);
	const [refreshing, setRefreshing] = useState(false);
	const { getPostDetail, post, loading, advertisePost, adsLoading, getAdvertisePost, page, ads, adsAll } =
		AdsViewModel(defaultPostRepo);

	const getTomorrow = () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow;
	};

	const [date, setDate] = useState<Date>(getTomorrow());

	const paymentMethods = [
		{
			id: "momo",
			name: "MoMo",
			image: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
		},
	];

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		try {
			await getPostDetail(postId);
			await getAdvertisePost(page, postId);
		} finally {
			setRefreshing(false);
		}
	}, [postId, page]);

	const [isHistoryExpanded, setHistoryExpanded] = useState(false);

	// Animation cho phần mở rộng/thu gọn lịch sử
	const [expandHeight] = useState(new Animated.Value(0));

	useEffect(() => {
		if (isHistoryExpanded) {
			Animated.timing(expandHeight, {
				toValue: 250, // Chiều cao khi mở rộng
				duration: 300,
				useNativeDriver: false,
			}).start();
		} else {
			Animated.timing(expandHeight, {
				toValue: 0, // Chiều cao khi thu gọn
				duration: 300,
				useNativeDriver: false,
			}).start();
		}
	}, [isHistoryExpanded]);

	const renderPost = useCallback(() => {
		if (loading) {
			return (
				<View
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
				>
					<ActivityIndicator size="large" color={brandPrimary} />
				</View>
			);
		} else {
			return (
				<Post post={post} noFooter>
					{post?.parent_post && <Post post={post?.parent_post} isParentPost />}
				</Post>
			);
		}
	}, [post, loading]);

	const renderAds = useCallback(() => {
		if (loading) return null;
		return (
			<>
				{post?.is_advertisement ? (
					<>
						{/* Lịch sử Quảng Cáo */}
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<View style={styles.activeIndicator}>
								<View style={styles.greenDot} />
								<Text style={styles.activeText}>{localStrings.Ads.ActiveCampaign}</Text>
							</View>
						</View>
						<View style={styles.historyContainer}>
							<View style={styles.historyCard}>
								<View style={styles.historyHeader}>
									<Text style={styles.historyTitle}>
										{localStrings.Ads.Campaign} #1
									</Text>
									<FontAwesome name="calendar" size={20} color={brandPrimary} />
								</View>
								<View style={styles.historyContent}>
									<Text style={styles.historyText}>
										<Text style={styles.boldText}>{localStrings.Ads.Campaign}:</Text>{" "}
										{DateTransfer(ads?.start_date)}
									</Text>
									<Text style={styles.historyText}>
										<Text style={styles.boldText}>{localStrings.Ads.End}:</Text>{" "}
										{DateTransfer(ads?.end_date)}
									</Text>
									<Text style={styles.historyText}>
										<Text style={styles.boldText}>{localStrings.Ads.RemainingTime}:</Text>{" "}
										{ads?.day_remaining} {localStrings.Ads.Day}
									</Text>
								</View>
							</View>
						</View>
					</>
				) : (
					<>
						{/* Thông tin quảng cáo */}
						<View style={{ flex: 1, paddingHorizontal: 10 }}>
							<View>
								<Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
									{localStrings.Ads.TimeAndBudget}
								</Text>
								<Text style={{ color: "gray", fontSize: 14 }}>
									{localStrings.Ads.Minimum.replace(
										"{{price}}",
										`${CurrencyFormat(price)}`
									)}
								</Text>
								<Text style={{ color: "gray", fontSize: 14 }}>
									VAT: 10%
								</Text>
							</View>

							{/* Chọn thời gian quảng cáo */}
							<TouchableOpacity
								style={{
									flexDirection: "row",
									alignItems: "center",
									borderWidth: 1,
									borderColor: "#ccc",
									padding: 10,
									marginVertical: 10,
									borderRadius: 10,
								}}
								onPress={() => {
									setShowDatePicker(true);
								}}
							>
								<FontAwesome name="calendar" size={24} color={brandPrimary} />
								<Text style={{ paddingLeft: 20 }}>
									{`${localStrings.Ads.TimeAds} ${DateTransfer(
										date
									)} (${diffDay} ${localStrings.Public.Day.toLowerCase()})`}
								</Text>
							</TouchableOpacity>
							{showDatePicker && (
								<MyDateTimePicker
									value={date}
									show={showDatePicker}
									onCancel={() => setShowDatePicker(false)}
									onSubmit={(selectedDate) => {
										setDate(selectedDate);
										setDiffDay(getDayDiff(selectedDate));
									}}
									minDate={getTomorrow()}
									maxDate={dayjs().add(30, "day").toDate()}
								/>
							)}

							{/* Ngân sách */}
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									borderWidth: 1,
									borderColor: "#ccc",
									padding: 10,
									marginVertical: 10,
									borderRadius: 10,
								}}
							>
								<Ionicons name="cash" size={24} color={brandPrimary} />
								<Text style={{ paddingLeft: 20 }}>
									{localStrings.Ads.BudgetAds}{" "}
									{CurrencyFormat(AdsCalculate(diffDay, price))}
								</Text>
							</View>

							{/* Phương thức thanh toán */}
							<View style={{ flexDirection: "row", marginTop: 10 }}>
								<Text style={{ fontWeight: "bold", marginRight: 10 }}>
									{localStrings.Ads.PaymentMethod}
								</Text>
								<View
									style={{ flexDirection: "row", justifyContent: "space-around" }}
								>
									{paymentMethods.map((item) => (
										<TouchableOpacity
											key={item.id}
											onPress={() => setMethod(item.id)}
											style={[
												styles.option,
												method === item.id && styles.selectedOption,
											]}
										>
											<Image
												source={{ uri: item.image }}
												style={{ width: 50, height: 50 }}
											/>
										</TouchableOpacity>
									))}
								</View>
							</View>
						</View>
					</>
				)}
			</>
		)
	}, [postId, adsLoading, ads, loading, post, showDatePicker]);

	useFocusEffect(
		useCallback(() => {
			if (postId) {
				getPostDetail(postId);
				getAdvertisePost(page, postId);
			}
		}, [postId])
	)

	return (
		<View style={{ flex: 1 }}>
			{/* Header */}
			<View
				style={{
					backgroundColor: backgroundColor,
					paddingTop: Platform.OS === "ios" ? 40 : 0,
				}}
			>
				<StatusBar barStyle="dark-content" />
				<View
					style={{
						flexDirection: "row",
						alignItems: "flex-end",
						height: 60,
						paddingBottom: 10,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							paddingHorizontal: 10,
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<TouchableOpacity
							onPress={() => {
								if (router.canGoBack()) {
									router.back();
								} else
									router.push('/home');
							}}
						>
							<Ionicons
								name="arrow-back-outline"
								size={24}
								color={brandPrimary}
							/>
						</TouchableOpacity>
						<Text style={{ fontWeight: "bold", fontSize: 20, marginLeft: 10 }}>
							{localStrings.Ads.Ads}
						</Text>
					</View>
				</View>
			</View>

			{/* Content */}
			<View style={{ flex: 1 }}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor={brandPrimary} // Màu loader trên iOS
							colors={[brandPrimary]} // Màu loader trên Android
						/>
					}
				>
					{/* bài viết được chọn */}
					{renderPost()}
					{renderAds()}
				</ScrollView>
				{/* Lịch sử quảng cáo */}
				<View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
					<TouchableOpacity
						style={[styles.historyToggleButton, {
							backgroundColor: backgroundColor,
							paddingHorizontal: 10,
							borderRadius: 10
						}]}
						onPress={() => setHistoryExpanded((prev) => !prev)}
					>
						<Text style={{ fontWeight: "bold", fontSize: 16 }}>
							{isHistoryExpanded ? localStrings.Ads.HideCampaign : localStrings.Ads.ShowCampaign}
						</Text>
						<Ionicons
							name={isHistoryExpanded ? "chevron-up" : "chevron-down"}
							size={20}
							color={brandPrimary}
						/>
					</TouchableOpacity>
					<Animated.View
						style={[styles.historyContainer, { height: expandHeight }]}>
						{(adsAll?.length ?? 0) > 0 ? (
							<FlatList
								data={adsAll}
								showsVerticalScrollIndicator={false}
								keyExtractor={(item) => item?.id as string}
								renderItem={({ item, index }) => (
									<View style={[styles.historyCard, { backgroundColor: backgroundColor }]}>
										<View style={styles.historyHeader}>
											<Text style={styles.historyTitle}>
												{localStrings.Ads.Campaign} #{index + 1}
											</Text>
											<FontAwesome name="calendar" size={20} color={brandPrimary} />
										</View>
										<View style={styles.historyContent}>
											<Text style={styles.historyText}>
												<Text style={styles.boldText}>{localStrings.Ads.Campaign}:</Text>{" "}
												{DateTransfer(item?.start_date)}
											</Text>
											<Text style={styles.historyText}>
												<Text style={styles.boldText}>{localStrings.Ads.End}:</Text>{" "}
												{DateTransfer(item?.end_date)}
											</Text>
											{item?.bill?.status && (
												<Text style={styles.historyText}>
													<Text style={styles.boldText}>{localStrings.Ads.RemainingTime}:</Text>
													{item?.day_remaining ? `${item?.day_remaining} ${localStrings.Ads.Day}` : "Đã kết thúc"}
												</Text>)}
											<Text style={styles.historyText}>
												<Text style={styles.boldText}>{localStrings.Ads.Grant}:</Text>{" "}
												{item?.bill?.price ? CurrencyFormat(item?.bill?.price) : NaN}
											</Text>
											<Text style={styles.historyText}>
												<Text style={styles.boldText}>{localStrings.Ads.PaymentMethod}:</Text>{" "}
												{method === "momo" ? "MoMo" : "Khác"}
											</Text>
											<Text style={styles.historyText}>
												<Text style={styles.boldText}>{localStrings.Ads.Status}:</Text>{" "}
												{item?.bill?.status ? localStrings.Ads.PaymentSuccess : localStrings.Ads.PaymentFailed}
											</Text>
										</View>
									</View>
								)}
							/>
						) : (
							<View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10, }}>
								<Text style={{ fontSize: 16, fontWeight: "bold" }}>
									{localStrings.Ads.NoCampaign}
								</Text>
							</View>
						)}

					</Animated.View>
				</View>
			</View>

			{/* Footer */}
			{!post?.is_advertisement && (
				<View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
					<Button
						type="primary"
						onPress={() => {
							advertisePost({
								post_id: postId,
								redirect_url: `${Linking.createURL(`/ads?postId=${postId}`)}`,
								end_date: (dayjs(date).format('YYYY-MM-DDT00:00:00') + "Z").toString(),
								start_date: (dayjs().format('YYYY-MM-DDT00:00:00') + "Z").toString(),
							})
						}}
						loading={adsLoading}
					>
						<Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
							{localStrings.Ads.Ads}
						</Text>
					</Button>
				</View>
			)}
			<Toast />
		</View>
	);
};

const styles = StyleSheet.create({
	option: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 5,
		marginRight: 10,
		borderRadius: 10,
	},
	selectedOption: {
		borderColor: "#4CAF50",
		backgroundColor: "#E8F5E9",
	},
	historyToggleButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 10,
	},
	historyContainer: {
		overflow: "hidden",
	},
	historyCard: {
		marginVertical: 8,
		marginHorizontal: 10,
		borderRadius: 10,
		padding: 15,
		// shadowColor: "#000",
		// shadowOffset: { width: 0, height: 2 },
		// shadowOpacity: 0.1,
		// shadowRadius: 5,
		// elevation: 3,
		borderWidth: 1,
		borderColor: "#eee",
		backgroundColor: "white",
	},
	historyHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	historyTitle: {
		fontWeight: "bold",
		fontSize: 16,
	},
	historyContent: {
		paddingLeft: 10,
	},
	historyText: {
		fontSize: 14,
		marginBottom: 5,
	},
	boldText: {
		fontWeight: "bold",
	},
	activeIndicator: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 10,
	},
	greenDot: {
		marginLeft: 10,
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#4CAF50",
		marginRight: 5,
	},
	activeText: {
		color: "#4CAF50",
		fontWeight: "bold",
		fontSize: 14,
	},
});

export default Ads;
