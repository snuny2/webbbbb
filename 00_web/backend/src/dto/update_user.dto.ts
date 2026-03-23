import { IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
    @MaxLength(30, { message: '이름은 30자 이하로 입력하세요.' })
    name?: string;

    @IsOptional()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsString()
    @MinLength(8, { message: '새 비밀번호는 최소 8자 이상이어야 합니다.' })
    @MaxLength(64)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
        message: '새 비밀번호는 영문과 숫자를 포함해야 합니다.',
    })
    newPassword?: string;

    @IsString()
    currentPassword: string;
}
