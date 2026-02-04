name := "Water_"
start:
failures := []

dir := DirSelect(A_WorkingDir "\assets",, "Select folder containing files")
if !dir
    ExitApp

Loop Files, dir "\*.*", "F"
{
    filePath := A_LoopFileFullPath
    fileName := A_LoopFileName
    fileExt  := A_LoopFileExt
    baseName := StrReplace(fileName, "." fileExt)

    ; Match <var>_1
    if !RegExMatch(baseName, "([^_]+)_1$", &m)
        continue

    var := m[1]
    code := ""

    switch var {
        case "bot":          code := "1111X0X1"
        case "botc1":        code := "0111X0X1"
        case "botc2":        code := "1101X0X1"
        case "botc12":       code := "0101X0X1"
        case "botend":       code := "X1X0X0X0"
        case "botleft":      code := "X111X0X0"
        case "botleftc2":    code := "X101X0X0"
        case "botright":     code := "11X0X0X1"
        case "botrightc1":   code := "01X0X0X1"
        case "c1":           code := "01111111"
        case "c2":           code := "11011111"
        case "c3":           code := "11110111"
        case "c4":           code := "11111101"
        case "c12":          code := "01011111"
        case "c13":          code := "01110111"
        case "c14":          code := "01111101"
        case "c23":          code := "11010111"
        case "c24":          code := "11011101"
        case "c34":          code := "11110101"
        case "c123":         code := "01010111"
        case "c124":         code := "01011101"
        case "c134":         code := "01110101"
        case "c1234":        code := "01010101"
        case "left":         code := "X11111X0"
        case "leftc2":       code := "X10111X0"
        case "leftc3":       code := "X11101X0"
        case "leftc23":      code := "X10101X0"
        case "leftend":      code := "X0X1X0X0"
        case "leftright":    code := "X1X0X1X0"
        case "mid":          code := "11111111"
        case "right":        code := "11X0X111"
        case "rightc1":      code := "01X0X111"
        case "rightc4":      code := "11X0X101"
        case "rightc14":     code := "01X0X101"
        case "rightend":     code := "X0X0X0X1"
        case "top":          code := "X0X11111"
        case "topbot":       code := "X0X1X0X1"
        case "topc3":        code := "X0X10111"
        case "topc4":        code := "X0X11101"
        case "topc34":       code := "X0X10101"
        case "topend":       code := "X0X0X1X0"
        case "topleft":      code := "X0X111X0"
        case "topleftc3":    code := "X0X101X0"
        case "topright":     code := "X0X0X111"
        case "toprightc4":   code := "X0X0X101"
        default:
            failures.Push(fileName)
            continue
    }

    newName := name code "." fileExt
    newPath := dir "\" newName

    try FileMove(filePath, newPath, true)
    catch
        failures.Push(fileName)
}

if failures.Length {
    MsgBox "Failed to process:`n" failures.Join("`n")
} else {
    MsgBox "All files processed successfully."
}
goto start