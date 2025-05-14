import { View, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import { GetBirthdayFriendsModel } from '@/src/api/features/friends/models/GetBirthdayFriends';
import { FriendRepo } from '@/src/api/features/friends/FriendRepo';
import { FriendResponseModel } from '@/src/api/features/profile/model/FriendReponseModel';
import { defaultProfileRepo } from '@/src/api/features/profile/ProfileRepository';
import Toast from 'react-native-toast-message';
import { GetUserNonFriendsModel } from '@/src/api/features/friends/models/GetUserNonFriends';

const FriendRequestAndUserViewModel = (repo: FriendRepo) => {
    const [birthdayFriends, setBirthdayFriends] = useState<GetBirthdayFriendsModel[]>([]);  
    const [loadingBirthday, setLoadingBirthday] = useState(false); 
    const [pageBirthday, setPageBirthday] = useState(1);
    const [pageFriendRequest, setPageFriendRequest] = useState(1);
    const limit = 10;
    const [hasMoreBirthday, setHasMoreBirthday] = useState(true);
    const [hasMoreFriendRequest, setHasMoreFriendRequest] = useState(true);
    const [totalBirthday, setTotalBirthday] = useState(0);
    const [totalFriendRequest, setTotalFriendRequest] = useState(0);
    const [loadingFriendRequests, setLoadingFriendRequests] = useState(false);
    const [incomingFriendRequests, setIncomingFriendRequests] = useState<FriendResponseModel[]>([]);
    const [userNonFriend, setUserNonFriend] = useState<GetUserNonFriendsModel[]>([]);
    const [pageNonFriend, setPageNonFriend] = useState(1);
    const [hasMoreNonFriend, setHasMoreNonFriend] = useState(true);
    const [totalNonFriend, setTotalNonFriend] = useState(0);
    const [loadingNonFriend, setLoadingNonFriend] = useState(false);
    const [visibleItems, setVisibleItems] = useState<string[]>([]);

        const onViewableItemsChanged = useRef(({ viewableItems }: any) => {    
            const visibleIds = viewableItems.map((item: any) => item.item.id);
            setVisibleItems(visibleIds);
          });
    const fetchBirthdayFriends = async (newPageBirth: number = 1) => {
        try {
            setLoadingBirthday(true);
            const response = await repo.getBirthdayFriends(
                {
                    page: newPageBirth,
                    limit: limit,
                }
            );
            if (!response?.error) {
                if (newPageBirth === 1) {
                    setBirthdayFriends(response?.data || []);
                }
                else {
                    setBirthdayFriends((prevPosts) => [...prevPosts, ...(response?.data || [])]);
                }
                const { page: currentPage, limit: currentLimit, total: totalRecords } = response?.paging;
                setPageBirthday(currentPage);
                setTotalBirthday(totalRecords);
                setHasMoreBirthday(currentPage * currentLimit < totalRecords);
            } else {
               Toast.show({
                    type: 'error',
                    text1: "Get Birthday Friends Failed",
                    text2: response?.error?.message,
                })
            }
        } catch (error: any) {
            console.error("Error fetching birthday friends:", error.message);
        }
         finally {
            setLoadingBirthday(false);
        }
    };

    const fetchFriendRequests = async (newPageFriend: number = 1) => {
        try {
            setLoadingFriendRequests(true);
            const response = await defaultProfileRepo.getListFriendsRequest({
                page: newPageFriend,
                limit: limit,
            });
            if (!response?.error) {
              if (newPageFriend === 1) {
                    setIncomingFriendRequests(response?.data || []);
                }
                else {
                    setIncomingFriendRequests((prevPosts) => [...prevPosts, ...(response?.data || [])]);
                }
                const { page: currentPage, limit: currentLimit, total: totalRecords } = response?.paging;
                setPageFriendRequest(currentPage);
                setTotalFriendRequest(totalRecords);
                setHasMoreFriendRequest(currentPage * currentLimit < totalRecords);

            }else {
                Toast.show({
                    type: 'error',
                    text1: "Get Friend Requests Failed",
                    text2: response?.error?.message,
                })
            }

        }
        catch (error: any) {
            console.error("Error fetching friend requests:", error.message);
        } finally {
            setLoadingFriendRequests(false);
        }
    };

     const fetchUserNonFriend = async (newPageUser: number = 1) => {
        try {
            setLoadingFriendRequests(true);
            const response = await repo.getUsersNonFriend({
                page: newPageUser,
                limit: limit,
            });
            if (!response?.error) {
              if (newPageUser === 1) {
                    setUserNonFriend(response?.data || []);
                }
                else {
                    setUserNonFriend((prevPosts) => [...prevPosts, ...(response?.data || [])]);
                }
                const { page: currentPage, limit: currentLimit, total: totalRecords } = response?.paging;
                setPageNonFriend(currentPage);
                setTotalNonFriend(totalRecords);
                setHasMoreNonFriend(currentPage * currentLimit < totalRecords);

            }else {
                Toast.show({
                    type: 'error',
                    text1: "Get User Requests Failed",
                    text2: response?.error?.message,
                })
            }

        }
        catch (error: any) {
            console.error("Error fetching friend requests:", error.message);
        } finally {
            setLoadingFriendRequests(false);
        }
    };

    const onRefreshBirthday = () => {
        setLoadingBirthday(true);
        fetchBirthdayFriends(1);
    }
    const onRefreshFriendRequest = () => {
        setLoadingFriendRequests(true);
        fetchFriendRequests(1);
    }

    const onRefreshNonFriend = () => {
        setLoadingNonFriend(true);
        fetchUserNonFriend(1);
    }


    const loadMoreBirthdayFriends = () => {
        if (hasMoreBirthday && !loadingBirthday) {
            setPageBirthday((prevPage) => prevPage + 1);
            fetchBirthdayFriends(pageBirthday + 1);
        }
    }
    const loadMoreFriendRequests = () => {  
        if (hasMoreFriendRequest && !loadingFriendRequests) {
            setPageFriendRequest((prevPage) => prevPage + 1);
            fetchFriendRequests(pageFriendRequest + 1);
        }
    }

    const loadMoreNonFriend = () => {
        if (hasMoreNonFriend && !loadingNonFriend) {
            setPageNonFriend((prevPage) => prevPage + 1);
            fetchUserNonFriend(pageNonFriend + 1);
        }
    }

            
  return {
    birthdayFriends,
    loadingBirthday,
    fetchBirthdayFriends,
    onRefreshBirthday,
    loadMoreBirthdayFriends,
    fetchFriendRequests,
    loadingFriendRequests,
    incomingFriendRequests,
    onRefreshFriendRequest,
    loadMoreFriendRequests,
    hasMoreBirthday,
    hasMoreFriendRequest,
    totalBirthday,
    totalFriendRequest,
    pageBirthday,
    pageFriendRequest,
    onViewableItemsChanged,
    visibleItems,
    fetchUserNonFriend,
    userNonFriend,
    loadingNonFriend,
    onRefreshNonFriend,
    loadMoreNonFriend,
    hasMoreNonFriend,
    totalNonFriend,
    pageNonFriend,
    setPageNonFriend,
  }
}

export default FriendRequestAndUserViewModel