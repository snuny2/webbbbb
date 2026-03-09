import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    name: string;

    @IsString()
    @MinLength(4)
    @MaxLength(30)
    // 영문/숫자/밑줄만 허용 예시
    @Matches(/^[a-zA-Z0-9_]+$/, { message: '아이디는 영문/숫자/밑줄만 가능합니다.' })
    userId: string;

    @IsString()
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    @MaxLength(64)
    // 대/소/숫자 중 2가지 이상 조합 예시 (원하면 강화 가능)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: '비밀번호는 영문과 숫자를 포함해야 합니다.' })
    password: string;
}
