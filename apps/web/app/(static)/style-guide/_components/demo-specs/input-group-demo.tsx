import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupIcon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"

export const inputGroupSnippet = `<InputGroup>
  <InputGroupIcon>
    <SearchIcon />
  </InputGroupIcon>
  <InputGroupInput placeholder="Search…" />
</InputGroup>`

export function InputGroupDemo() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroupIcon>
        <SearchIcon aria-hidden="true" />
      </InputGroupIcon>
      <InputGroupInput placeholder="Search…" />
    </InputGroup>
  )
}
