import { Injectable, HttpException } from '@nestjs/common';
import { UserFollowingEntity } from 'src/user/user.following.entity';
import { FollowDto } from './dto/follow.dto';
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class FollowService {
    constructor(
        private readonly userService: UserService,
    ) {}

    // [1] 팔로우
    async createFollow(userId : number, followingId : number): Promise<UserFollowingEntity> {

        const userEntity : UserEntity = await this.userService.findUserById(userId);
        const followingUserEntity : UserEntity = await this.userService.findUserById(followingId);
        console.log('현재 로그인한 유저 : ', userEntity);
        console.log('팔로우 대상 유저 : ', followingUserEntity);

        try{
            const userFollowingEntity = new UserFollowingEntity();
            userFollowingEntity.user = userEntity;
            userFollowingEntity.followUser = followingUserEntity;

            return userFollowingEntity.save();

        }catch(error){
            console.error('Error on following: ', error);
            throw new Error('Failed to following');
        }
    }

    // [2] 언팔로우
    async deleteFollow(userId: number, followingId:number): Promise<UserFollowingEntity> {
        console.log('언팔로우 서비스 호출');
        const followEntity : UserFollowingEntity = await UserFollowingEntity.findOneOrFail({ where:
                { user : {id : userId}, followUser : {id : followingId}}
        });

        try{
            return followEntity.softRemove();
        }catch(error){
            console.error('Error on unfollowing: ', error);
            throw new Error('Failed to unfollowing');
        }
    }

    // [3] 팔로우 리스트 조회
    async getFollowList(userId: number): Promise<FollowDto[]> {
        // 현재 로그인한 사용자
        const user : UserEntity = await this.userService.findUserById(userId);
        console.log('현재 로그인한 사용자 : ',user.id);

        // 로그인한 사용자 = 팔로우하는 user
        const follows : UserFollowingEntity[] = await this.userService.getFollowingList(userId);

        // 팔로우 사용자들 정보 리스트
        const informs = await Promise.all(follows.map(async (follow) => {
            const followDto : FollowDto = new FollowDto();
            const mateEntity : UserEntity = follow.followUser;
            console.log('팔로우 사용자의 ID : ', mateEntity.id);

            followDto.nickName = mateEntity.nickname;
            followDto.mateId = mateEntity.id;
            followDto.email = mateEntity.email;
            followDto.introduction = mateEntity.introduction;
            followDto.isFollowing = !!follow.id;
            const image = await this.userService.getProfileImage(mateEntity.id);
            followDto.image = image.imageKey;

            return followDto;
        }))

        return informs;
    }

    // [4] 팔로워 리스트 조회
    async getFollowerList(userId: number): Promise<FollowDto[]> {
        // 현재 로그인한 사용자
        const user : UserEntity = await this.userService.findUserById(userId);
        console.log('현재 로그인한 사용자 : ',user.id);

        // 로그인한 사용자 = 팔로워
        const follows : UserFollowingEntity[] = await this.userService.getFollowerList(userId);

        // 팔로워 사용자들 정보 리스트
        const informs = await Promise.all(follows.map(async (follow) => {
            const followDto : FollowDto = new FollowDto();
            const mateEntity : UserEntity = follow.user;
            console.log('팔로워 사용자 ID : ', mateEntity.id);

            followDto.nickName = mateEntity.nickname;
            followDto.mateId = mateEntity.id;
            followDto.email = mateEntity.email;
            followDto.introduction = mateEntity.introduction;
            followDto.isFollowing = !!follow.id;
            const image = await this.userService.getProfileImage(mateEntity.id);
            followDto.image = image.imageKey;

            return followDto;
        }))

        return informs;
    }
}
