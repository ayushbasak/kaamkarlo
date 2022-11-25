import { Box, HStack, Link, Spacer, Text, useColorModeValue } from "@chakra-ui/react";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { BiGlobe } from "react-icons/bi";
function Footer() {
    // const { toggleColorMode } = useColorMode();
    const bg = useColorModeValue("pink.200", "pink.700");
    const color = useColorModeValue("pink.700", "pink.200");
    return (
        <Box 
            p={2} 
            bg={bg}
            color={color}
            w="100%" 
            position="fixed"
            bottom="0" 
            // m='auto' 
            zIndex={100}
            alignItems='center'
        >
            <HStack
                spacing={4}
                justifyContent='center'
                alignItems='center'
            >    
            <Text top='100%'>made with ❤ by @ayushbasak</Text>
            <Link href="https://github.com/ayushbasak"><AiFillGithub/></Link>
            <Link href="https://linkedin.com/in/ayushbasak"><AiFillLinkedin/></Link>
            <Link href="https://basak.app"><BiGlobe/></Link>
            </HStack>
            <Text>report bugs here: 
                <Link href="https://github.com/ayushbasak/kaamkarlo/issues" target='_blank'>@github_issues</Link>
                <Spacer />
                &copy; 2022 KaamKarlo v2.0
            </Text>
        </Box>
    );
}

export default Footer;