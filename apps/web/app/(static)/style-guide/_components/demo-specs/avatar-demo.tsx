import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@workspace/ui/components/avatar"

export const avatarSnippet = `<Avatar size="sm"><AvatarFallback>KK</AvatarFallback></Avatar>
<Avatar><AvatarFallback>KK</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>KK</AvatarFallback></Avatar>`

export function AvatarDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>KK</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>KK</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>KK</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </div>
  )
}
