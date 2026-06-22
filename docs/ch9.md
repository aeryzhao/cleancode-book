# 第 9 章 Unit Tests 单元测试

![](/figures/ch9/9_1fig_martin.jpg)

Our profession has come a long way in the last ten years. In 1997 no one had heard of Test Driven Development. For the vast majority of us, unit tests were short bits of throw-away code that we wrote to make sure our programs "worked." We would painstakingly write our classes and methods, and then we would concoct some ad hoc code to test them. Typically this would involve some kind of simple driver program that would allow us to manually interact with the program we had written.

> 我们这个行业在过去十年中取得了长足的进步。1997 年，没人听说过测试驱动开发（Test Driven Development）。对我们大多数人来说，单元测试只是我们为确保程序"能运行"而编写的短小的一次性代码。我们会煞费苦心地编写类和方法，然后拼凑一些临时代码来测试它们。通常这会涉及某种简单的驱动程序，让我们能够手动与编写的程序进行交互。

I remember writing a C++ program for an embedded real-time system back in the mid-90s. The program was a simple timer with the following signature:

> 我记得在 90 年代中期为一个嵌入式实时系统编写过一个 C++ 程序。该程序是一个简单的计时器，具有以下签名：

```cpp
   void Timer::ScheduleCommand(Command* theCommand, int milliseconds)
```

The idea was simple; the execute method of the Command would be executed in a new thread after the specified number of milliseconds. The problem was, how to test it.

> 想法很简单；Command 的 execute 方法会在指定毫秒数后在新线程中执行。问题是，如何测试它。

I cobbled together a simple driver program that listened to the keyboard. Every time a character was typed, it would schedule a command that would type the same character five seconds later. Then I tapped out a rhythmic melody on the keyboard and waited for that melody to replay on the screen five seconds later.

> 我拼凑了一个监听键盘的简单驱动程序。每次键入一个字符，它就会安排一个命令在五秒后键入相同的字符。然后我在键盘上敲出一段有节奏的旋律，等待这段旋律在五秒后在屏幕上重播。

"I … want-a-girl … just … like-the-girl-who-marr … ied … dear … old … dad."

> "我……想要一个女孩……就像……嫁给……亲爱……的老……爸爸……的那个女孩。"

I actually sang that melody while typing the "." key, and then I sang it again as the dots appeared on the screen.

> 我一边唱着那段旋律一边敲击"."键，然后当屏幕上出现那些点时，我又唱了一遍。

That was my test! Once I saw it work and demonstrated it to my colleagues, I threw the test code away.

> 那就是我的测试！一旦我看到它工作并向同事演示完毕，我就把测试代码扔掉了。

As I said, our profession has come a long way. Nowadays I would write a test that made sure that every nook and cranny of that code worked as I expected it to. I would isolate my code from the operating system rather than just calling the standard timing functions. I would mock out those timing functions so that I had absolute control over the time. I would schedule commands that set boolean flags, and then I would step the time forward, watching those flags and ensuring that they went from false to true just as I changed the time to the right value.

> 正如我所说，我们的行业已经走了很长一段路。如今，我会编写测试来确保代码的每个角落都按预期工作。我会将代码与操作系统隔离，而不是仅仅调用标准的定时函数。我会模拟那些定时函数，以便完全控制时间。我会安排设置布尔标志的命令，然后将时间向前推进，观察那些标志，确保它们在我将时间更改为正确值时从 false 变为 true。

Once I got a suite of tests to pass, I would make sure that those tests were convenient to run for anyone else who needed to work with the code. I would ensure that the tests and the code were checked in together into the same source package.

> 一旦我让一套测试通过，我会确保这些测试对于其他需要使用该代码的人来说运行方便。我会确保测试和代码一起检入到同一个源代码包中。

Yes, we've come a long way; but we have farther to go. The Agile and TDD movements have encouraged many programmers to write automated unit tests, and more are joining their ranks every day. But in the mad rush to add testing to our discipline, many programmers have missed some of the more subtle, and important, points of writing good tests.

> 是的，我们已经走了很长一段路；但我们还有更远的路要走。敏捷和 TDD 运动鼓励了许多程序员编写自动化单元测试，每天都有更多人加入他们的行列。但在将测试纳入我们学科的疯狂冲刺中，许多程序员忽略了编写良好测试的一些更微妙、更重要的要点。

## 9.1 THE THREE LAWS OF TDD TDD 的三条法则

By now everyone knows that TDD asks us to write unit tests first, before we write production code. But that rule is just the tip of the iceberg. Consider the following three laws:1

> 如今每个人都知道 TDD 要求我们在编写生产代码之前先编写单元测试。但这条规则只是冰山一角。考虑以下三条法则：[1]

1. Professionalism and Test-Driven Development, Robert C. Martin, Object Mentor, IEEE Software, May/June 2007 (Vol. 24, No. 3) pp. 32–36

> [1] Professionalism and Test-Driven Development, Robert C. Martin, Object Mentor, IEEE Software, May/June 2007 (Vol. 24, No. 3) pp. 32–36

http://doi.ieeecomputersociety.org/10.1109/MS.2007.85

First Law You may not write production code until you have written a failing unit test.

> 第一条法则：在编写一个失败的单元测试之前，不得编写生产代码。

Second Law You may not write more of a unit test than is sufficient to fail, and not compiling is failing.

> 第二条法则：不得编写超过刚好足以失败的单元测试代码，而编译不通过就是失败。

Third Law You may not write more production code than is sufficient to pass the currently failing test.

> 第三条法则：不得编写超过刚好足以通过当前失败测试的生产代码。

These three laws lock you into a cycle that is perhaps thirty seconds long. The tests and the production code are written together, with the tests just a few seconds ahead of the production code.

> 这三条法则将你锁定在一个大约三十秒的循环中。测试和生产代码一起编写，测试只比生产代码提前几秒。

If we work this way, we will write dozens of tests every day, hundreds of tests every month, and thousands of tests every year. If we work this way, those tests will cover virtually all of our production code. The sheer bulk of those tests, which can rival the size of the production code itself, can present a daunting management problem.

> 如果我们这样工作，每天会编写数十个测试，每月数百个，每年数千个。如果我们这样工作，这些测试将覆盖几乎所有生产代码。这些测试的巨大数量，可以与生产代码本身的规模相媲美，会带来令人畏惧的管理问题。

## 9.2 KEEPING TESTS CLEAN 保持测试整洁

Some years back I was asked to coach a team who had explicitly decided that their test code should not be maintained to the same standards of quality as their production code. They gave each other license to break the rules in their unit tests. "Quick and dirty" was the watchword. Their variables did not have to be well named, their test functions did not need to be short and descriptive. Their test code did not need to be well designed and thoughtfully partitioned. So long as the test code worked, and so long as it covered the production code, it was good enough.

> 几年前，我被邀请去指导一个团队，他们明确决定测试代码不应与生产代码维护相同的质量标准。他们相互允许在单元测试中打破规则。"快速而粗糙"是他们的口号。他们的变量不需要有好的命名，测试函数不需要简短且具有描述性。测试代码不需要精心设计和深思熟虑的划分。只要测试代码能运行，只要它覆盖了生产代码，那就足够了。

Some of you reading this might sympathize with that decision. Perhaps, long in the past, you wrote tests of the kind that I wrote for that Timer class. It's a huge step from writing that kind of throw-away test, to writing a suite of automated unit tests. So, like the team I was coaching, you might decide that having dirty tests is better than having no tests.

> 读到这里的你可能会同情那个决定。也许在很久以前，你也写过类似我为那个 Timer 类编写的测试。从编写那种一次性测试到编写一套自动化单元测试，是一个巨大的飞跃。所以，就像我指导的那个团队一样，你可能认为有脏测试总比没有测试好。

What this team did not realize was that having dirty tests is equivalent to, if not worse than, having no tests. The problem is that tests must change as the production code evolves. The dirtier the tests, the harder they are to change. The more tangled the test code, the more likely it is that you will spend more time cramming new tests into the suite than it takes to write the new production code. As you modify the production code, old tests start to fail, and the mess in the test code makes it hard to get those tests to pass again. So the tests become viewed as an ever-increasing liability.

> 这个团队没有意识到的是，有脏测试等同于没有测试，甚至更糟。问题在于，随着生产代码的演进，测试也必须随之改变。测试越脏，就越难改变。测试代码越混乱，你就越可能花更多时间将新测试塞入测试套件，而不是编写新的生产代码。当你修改生产代码时，旧测试开始失败，而测试代码中的混乱使得这些测试很难再次通过。因此，测试被视为不断增加的负担。

From release to release the cost of maintaining my team's test suite rose. Eventually it became the single biggest complaint among the developers. When managers asked why their estimates were getting so large, the developers blamed the tests. In the end they were forced to discard the test suite entirely.

> 版本接版本，维护团队测试套件的成本不断上升。最终，它成为开发者最大的抱怨。当经理们问为什么他们的估算变得如此之大时，开发者们将责任归咎于测试。最终他们被迫完全丢弃测试套件。

But, without a test suite they lost the ability to make sure that changes to their code base worked as expected. Without a test suite they could not ensure that changes to one part of their system did not break other parts of their system. So their defect rate began to rise. As the number of unintended defects rose, they started to fear making changes. They stopped cleaning their production code because they feared the changes would do more harm than good. Their production code began to rot. In the end they were left with no tests, tangled and bug-riddled production code, frustrated customers, and the feeling that their testing effort had failed them.

> 但是，没有测试套件，他们失去了确保代码库更改按预期工作的能力。没有测试套件，他们无法确保系统某部分的更改不会破坏其他部分。因此，缺陷率开始上升。随着意外缺陷数量的增加，他们开始害怕做更改。他们停止清理生产代码，因为他们担心更改会弊大于利。生产代码开始腐烂。最终，他们没有测试，生产代码混乱且充满 bug，客户感到沮丧，并且觉得测试工作让他们失望了。

In a way they were right. Their testing effort had failed them. But it was their decision to allow the tests to be messy that was the seed of that failure. Had they kept their tests clean, their testing effort would not have failed. I can say this with some certainty because I have participated in, and coached, many teams who have been successful with clean unit tests.

> 从某种意义上说，他们是对的。测试工作确实让他们失望了。但允许测试变得混乱是失败的种子。如果他们保持测试整洁，测试工作就不会失败。我可以比较确定地说这一点，因为我参与过并指导过许多在整洁单元测试方面取得成功的团队。

The moral of the story is simple: Test code is just as important as production code. It is not a second-class citizen. It requires thought, design, and care. It must be kept as clean as production code.

> 这个故事的寓意很简单：测试代码与生产代码同等重要。它不是二等公民。它需要思考、设计和关怀。它必须像生产代码一样保持整洁。

Tests Enable the -ilities 测试使能各种"性"

If you don't keep your tests clean, you will lose them. And without them, you lose the very thing that keeps your production code flexible. Yes, you read that correctly. It is unit tests that keep our code flexible, maintainable, and reusable. The reason is simple. If you have tests, you do not fear making changes to the code! Without tests every change is a possible bug. No matter how flexible your architecture is, no matter how nicely partitioned your design, without tests you will be reluctant to make changes because of the fear that you will introduce undetected bugs.

> 如果你不保持测试整洁，你将失去它们。而没有它们，你就失去了保持生产代码灵活性的关键。是的，你没看错。正是单元测试使我们的代码保持灵活、可维护和可复用。原因很简单。如果有测试，你就不怕对代码做更改！没有测试，每次更改都是一个潜在的 bug。无论你的架构多么灵活，无论你的设计划分得多么好，没有测试，你会因为害怕引入未被发现的 bug 而不愿做更改。

But with tests that fear virtually disappears. The higher your test coverage, the less your fear. You can make changes with near impunity to code that has a less than stellar architecture and a tangled and opaque design. Indeed, you can improve that architecture and design without fear!

> 但有了测试，这种恐惧几乎消失了。测试覆盖率越高，恐惧越少。你几乎可以肆无忌惮地更改架构不佳、设计混乱不透明的代码。事实上，你可以毫无畏惧地改进架构和设计！

So having an automated suite of unit tests that cover the production code is the key to keeping your design and architecture as clean as possible. Tests enable all the -ilities, because tests enable change.

> 因此，拥有一套覆盖生产代码的自动化单元测试是保持设计和架构尽可能整洁的关键。测试使能所有"性"，因为测试使能变更。

So if your tests are dirty, then your ability to change your code is hampered, and you begin to lose the ability to improve the structure of that code. The dirtier your tests, the dirtier your code becomes. Eventually you lose the tests, and your code rots.

> 所以如果你的测试很脏，你更改代码的能力就会受到阻碍，你开始失去改进代码结构的能力。测试越脏，代码就越脏。最终你失去了测试，代码也腐烂了。

## 9.3 CLEAN TESTS 整洁的测试

What makes a clean test? Three things. Readability, readability, and readability. Readability is perhaps even more important in unit tests than it is in production code. What makes tests readable? The same thing that makes all code readable: clarity, simplicity, and density of expression. In a test you want to say a lot with as few expressions as possible.

> 什么使测试整洁？三件事。可读性、可读性、还是可读性。可读性在单元测试中可能比在生产代码中更重要。什么使测试可读？与使所有代码可读的东西相同：清晰、简洁和表达密度。在测试中，你希望用尽可能少的表达说明尽可能多的内容。

Consider the code from FitNesse in Listing 9-1. These three tests are difficult to understand and can certainly be improved. First, there is a terrible amount of duplicate code [G5] in the repeated calls to addPage and assertSubString. More importantly, this code is just loaded with details that interfere with the expressiveness of the test.

> 考虑代码清单 9-1 中来自 FitNesse 的代码。这三个测试难以理解，当然可以改进。首先，在对 addPage 和 assertSubString 的重复调用中存在大量重复代码 [G5]。更重要的是，这段代码充满了干扰测试表达力的细节。

Listing 9-1 SerializedPageResponderTest.java

代码清单 9-1 SerializedPageResponderTest.java
```java
   public void testGetPageHieratchyAsXml() throws Exception
   {

     crawler.addPage(root, PathParser.parse("PageOne"));
     crawler.addPage(root, PathParser.parse("PageOne.ChildOne"));
     crawler.addPage(root, PathParser.parse("PageTwo"));
 
     request.setResource("root");
     request.addInput("type", "pages");
     Responder responder = new SerializedPageResponder();
     SimpleResponse response =
       (SimpleResponse) responder.makeResponse(
          new FitNesseContext(root), request);
     String xml = response.getContent();
 
     assertEquals("text/xml", response.getContentType());
     assertSubString("<name>PageOne</name>", xml);
     assertSubString("<name>PageTwo</name>", xml);
     assertSubString("<name>ChildOne</name>", xml);
   }
   public void testGetPageHieratchyAsXmlDoesntContainSymbolicLinks()
   throws Exception {
 
     WikiPage pageOne = crawler.addPage(root, PathParser.parse("PageOne"));
     crawler.addPage(root, PathParser.parse("PageOne.ChildOne"));
     crawler.addPage(root, PathParser.parse("PageTwo"));
 
     PageData data = pageOne.getData();
     WikiPageProperties properties = data.getProperties();
     WikiPageProperty symLinks = properties.set(SymbolicPage.PROPERTY_NAME);
     symLinks.set("SymPage", "PageTwo");
     pageOne.commit(data);
 
     request.setResource("root");
     request.addInput("type", "pages");
     Responder responder = new SerializedPageResponder();
     SimpleResponse response =
       (SimpleResponse) responder.makeResponse(
          new FitNesseContext(root), request);
     String xml = response.getContent();
 
     assertEquals("text/xml", response.getContentType());
     assertSubString("<name>PageOne</name>", xml);
     assertSubString("<name>PageTwo</name>", xml);
     assertSubString("<name>ChildOne</name>", xml);
     assertNotSubString("SymPage", xml);
   }
 
   public void testGetDataAsHtml() throws Exception
   {
     crawler.addPage(root, PathParser.parse("TestPageOne"), "test page");
 
     request.setResource("TestPageOne");
     request.addInput("type", "data"); 
     Responder responder = new SerializedPageResponder();
     SimpleResponse response =
       (SimpleResponse) responder.makeResponse(
          new FitNesseContext(root), request);
     String xml = response.getContent();
 
     assertEquals("text/xml", response.getContentType());
     assertSubString("test page", xml);
     assertSubString("<Test", xml);
   }
```

For example, look at the PathParser calls. They transform strings into PagePath instances used by the crawlers. This transformation is completely irrelevant to the test at hand and serves only to obfuscate the intent. The details surrounding the creation of the responder and the gathering and casting of the response are also just noise. Then there's the ham-handed way that the request URL is built from a resource and an argument. (I helped write this code, so I feel free to roundly criticize it.)

> 例如，看看 PathParser 调用。它们将字符串转换为爬虫使用的 PagePath 实例。这种转换与当前测试完全无关，只是混淆了意图。围绕响应器的创建以及响应的收集和转换的细节也只是噪音。然后是用资源和参数构建请求 URL 的笨拙方式。（我参与了这段代码的编写，所以我可以随意批评它。）

In the end, this code was not designed to be read. The poor reader is inundated with a swarm of details that must be understood before the tests make any real sense.

> 最终，这段代码不是为阅读而设计的。可怜的读者被大量细节淹没，必须理解这些细节才能让测试真正有意义。

Now consider the improved tests in Listing 9-2. These tests do the exact same thing, but they have been refactored into a much cleaner and more explanatory form.

> 现在考虑代码清单 9-2 中改进后的测试。这些测试做的是完全相同的事情，但它们被重构为更整洁、更具解释性的形式。

Listing 9-2 SerializedPageResponderTest.java (refactored)

代码清单 9-2 SerializedPageResponderTest.java（重构版本）
```java
   public void testGetPageHierarchyAsXml() throws Exception {
     makePages("PageOne", "PageOne.ChildOne", "PageTwo");
 
     submitRequest("root", "type:pages");
 
     assertResponseIsXML();
     assertResponseContains(
       "<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>"
     );
   }
 
   public void testSymbolicLinksAreNotInXmlPageHierarchy() throws Exception {
     WikiPage page = makePage("PageOne");
     makePages("PageOne.ChildOne", "PageTwo");
 
     addLinkTo(page, "PageTwo", "SymPage");
 
     submitRequest("root", "type:pages");
 
     assertResponseIsXML();
     assertResponseContains(
       "<name>PageOne</name>", "<name>PageTwo</name>",
              "<name>ChildOne</name>"
     );
     assertResponseDoesNotContain("SymPage");
   } 
 
   public void testGetDataAsXml() throws Exception {
     makePageWithContent("TestPageOne", "test page");
 
     submitRequest("TestPageOne", "type:data");
 
     assertResponseIsXML();
     assertResponseContains("test page", "<Test");
   }
```

The BUILD-OPERATE-CHECK2 pattern is made obvious by the structure of these tests. Each of the tests is clearly split into three parts. The first part builds up the test data, the second part operates on that test data, and the third part checks that the operation yielded the expected results.

> 构建-操作-检查（BUILD-OPERATE-CHECK）[2]模式通过这些测试的结构变得显而易见。每个测试都清晰地分为三部分。第一部分构建测试数据，第二部分对测试数据进行操作，第三部分检查操作是否产生了预期结果。

2. http://fitnesse.org/FitNesse.AcceptanceTestPatterns

> [2] http://fitnesse.org/FitNesse.AcceptanceTestPatterns

Notice that the vast majority of annoying detail has been eliminated. The tests get right to the point and use only the data types and functions that they truly need. Anyone who reads these tests should be able to work out what they do very quickly, without being misled or overwhelmed by details.

> 注意，绝大多数烦人的细节已被消除。测试直奔主题，只使用它们真正需要的数据类型和函数。任何阅读这些测试的人都应该能够很快理解它们做了什么，而不会被细节误导或淹没。

### 9.3.1 Domain-Specific Testing Language 领域特定测试语言

The tests in Listing 9-2 demonstrate the technique of building a domain-specific language for your tests. Rather than using the APIs that programmers use to manipulate the system, we build up a set of functions and utilities that make use of those APIs and that make the tests more convenient to write and easier to read. These functions and utilities become a specialized API used by the tests. They are a testing language that programmers use to help themselves to write their tests and to help those who must read those tests later on.

> 代码清单 9-2 中的测试展示了为测试构建领域特定语言的技术。我们不是使用程序员用来操作系统的 API，而是构建一组利用这些 API 的函数和工具，使测试更方便编写、更容易阅读。这些函数和工具成为测试使用的专门 API。它们是一种测试语言，程序员用来帮助自己编写测试，也帮助那些以后必须阅读这些测试的人。

This testing API is not designed up front; rather it evolves from the continued refactoring of test code that has gotten too tainted by obfuscating detail. Just as you saw me refactor Listing 9-1 into Listing 9-2, so too will disciplined developers refactor their test code into more succinct and expressive forms.

> 这个测试 API 不是预先设计的；而是从持续重构被混淆细节污染的测试代码中演进而来的。正如你看到我将代码清单 9-1 重构为代码清单 9-2，有纪律的开发者也会将他们的测试代码重构为更简洁、更具表达力的形式。

### 9.3.2 A Dual Standard 双重标准

In one sense the team I mentioned at the beginning of this chapter had things right. The code within the testing API does have a different set of engineering standards than production code. It must still be simple, succinct, and expressive, but it need not be as efficient as production code. After all, it runs in a test environment, not a production environment, and those two environment have very different needs.

> 从某种意义上说，我在本章开头提到的团队是对的。测试 API 中的代码确实有一套与生产代码不同的工程标准。它仍然必须简洁、精炼且具有表达力，但不需要像生产代码那样高效。毕竟，它运行在测试环境中，而不是生产环境中，这两个环境有非常不同的需求。

Consider the test in Listing 9-3. I wrote this test as part of an environment control system I was prototyping. Without going into the details you can tell that this test checks that the low temperature alarm, the heater, and the blower are all turned on when the temperature is "way too cold."

> 考虑代码清单 9-3 中的测试。我编写这个测试是作为正在原型设计的环境控制系统的一部分。无需深入了解细节，你就可以看出这个测试检查的是当温度"太冷"时，低温报警器、加热器和鼓风机是否都打开了。

Listing 9-3 EnvironmentControllerTest.java

代码清单 9-3 EnvironmentControllerTest.java
```java
   @Test
     public void turnOnLoTempAlarmAtThreashold() throws Exception {
       hw.setTemp(WAY_TOO_COLD);
       controller.tic();
       assertTrue(hw.heaterState());
       assertTrue(hw.blowerState());
       assertFalse(hw.coolerState());
       assertFalse(hw.hiTempAlarm());
       assertTrue(hw.loTempAlarm());
     }
```

There are, of course, lots of details here. For example, what is that tic function all about? In fact, I'd rather you not worry about that while reading this test. I'd rather you just worry about whether you agree that the end state of the system is consistent with the temperature being "way too cold."

> 当然，这里有很多细节。例如，那个 tic 函数到底是怎么回事？事实上，我希望你在阅读这个测试时不要担心那个。我只希望你关心你是否同意系统的最终状态与温度"太冷"一致。

Notice, as you read the test, that your eye needs to bounce back and forth between the name of the state being checked, and the sense of the state being checked. You see heaterState, and then your eyes glissade left to assertTrue. You see coolerState and your eyes must track left to assertFalse. This is tedious and unreliable. It makes the test hard to read.

> 注意，当你阅读测试时，你的眼睛需要在被检查状态的名称和状态的含义之间来回跳动。你看到 heaterState，然后你的目光向左滑动到 assertTrue。你看到 coolerState，你的目光必须向左追踪到 assertFalse。这很乏味且不可靠。它使测试难以阅读。

I improved the reading of this test greatly by transforming it into Listing 9-4.

> 我通过将它转换为代码清单 9-4 极大地改善了这个测试的可读性。

Listing 9-4 EnvironmentControllerTest.java (refactored)

代码清单 9-4 EnvironmentControllerTest.java（重构版本）
```java
   @Test
     public void turnOnLoTempAlarmAtThreshold() throws Exception {
       wayTooCold();
       assertEquals("HBchL", hw.getState());
     }
```

Of course I hid the detail of the tic function by creating a wayTooCold function. But the thing to note is the strange string in the assertEquals. Upper case means "on," lower case means "off," and the letters are always in the following order: {heater, blower, cooler, hi-temp-alarm, lo-temp-alarm}.

> 当然，我通过创建 wayTooCold 函数隐藏了 tic 函数的细节。但需要注意的是 assertEquals 中的奇怪字符串。大写表示"开"，小写表示"关"，字母始终按以下顺序排列：{heater, blower, cooler, hi-temp-alarm, lo-temp-alarm}。

Even though this is close to a violation of the rule about mental mapping,3 it seems appropriate in this case. Notice, once you know the meaning, your eyes glide across that string and you can quickly interpret the results. Reading the test becomes almost a pleasure. Just take a look at Listing 9-5 and see how easy it is to understand these tests.

> 尽管这几乎违反了关于心智映射的规则[3]，但在这个案例中似乎是合适的。注意，一旦你知道了含义，你的目光滑过那个字符串，就能快速解读结果。阅读测试几乎变成了一种乐趣。看看代码清单 9-5，了解这些测试是多么容易理解。

3. "Avoid Mental Mapping" on page 25.

> [3] 第 25 页的"避免心智映射"。

Listing 9-5 EnvironmentControllerTest.java (bigger selection)

代码清单 9-5 EnvironmentControllerTest.java（更多选择）
```java
   @Test
   public void turnOnCoolerAndBlowerIfTooHot() throws Exception {
     tooHot();
     assertEquals("hBChl", hw.getState());
   }
 
   @Test
   public void turnOnHeaterAndBlowerIfTooCold() throws Exception {
     tooCold();
     assertEquals("HBchl", hw.getState());
   }
 
   @Test
   public void turnOnHiTempAlarmAtThreshold() throws Exception {
     wayTooHot();
     assertEquals("hBCHl", hw.getState());
   }
   @Test
   public void turnOnLoTempAlarmAtThreshold() throws Exception {
     wayTooCold();
     assertEquals("HBchL", hw.getState());
   }
```

The getState function is shown in Listing 9-6. Notice that this is not very efficient code. To make it efficient, I probably should have used a StringBuffer.

> getState 函数如代码清单 9-6 所示。注意这不是非常高效的代码。为了使它高效，我可能应该使用 StringBuffer。

Listing 9-6 MockControlHardware.java

代码清单 9-6 MockControlHardware.java
```java
   public String getState() {
     String state = "";
     state += heater ? "H" : "h";
     state += blower ? "B" : "b";
     state += cooler ? "C" : "c";
     state += hiTempAlarm ? "H" : "h";
     state += loTempAlarm ? "L" : "l";
     return state;
   }
```

StringBuffers are a bit ugly. Even in production code I will avoid them if the cost is small; and you could argue that the cost of the code in Listing 9-6 is very small. However, this application is clearly an embedded real-time system, and it is likely that computer and memory resources are very constrained. The test environment, however, is not likely to be constrained at all.

> StringBuffer 有点丑。即使在生产代码中，如果代价很小，我也会避免使用它们；你可以争辩说代码清单 9-6 中的代码代价非常小。然而，这个应用程序显然是一个嵌入式实时系统，计算机和内存资源可能非常受限。但测试环境不太可能受到限制。

That is the nature of the dual standard. There are things that you might never do in a production environment that are perfectly fine in a test environment. Usually they involve issues of memory or CPU efficiency. But they never involve issues of cleanliness.

> 这就是双重标准的本质。有些事情你在生产环境中可能永远不会做，但在测试环境中完全没问题。通常它们涉及内存或 CPU 效率的问题。但它们从不涉及整洁性的问题。

## 9.4 ONE ASSERT PER TEST 每个测试一个断言

There is a school of thought4 that says that every test function in a JUnit test should have one and only one assert statement. This rule may seem draconian, but the advantage can be seen in Listing 9-5. Those tests come to a single conclusion that is quick and easy to understand.

> 有一个学派[4]认为 JUnit 测试中的每个测试函数应该有且仅有一个 assert 语句。这条规则可能看起来过于严苛，但其优势可以从代码清单 9-5 中看出。那些测试得出了一个快速且易于理解的单一结论。

4. See Dave Astel's blog entry: http://www.artima.com/weblogs/viewpost.jsp?thread=35578

> [4] 参见 Dave Astel 的博客文章：http://www.artima.com/weblogs/viewpost.jsp?thread=35578

But what about Listing 9-2? It seems unreasonable that we could somehow easily merge the assertion that the output is XML and that it contains certain substrings. However, we can break the test into two separate tests, each with its own particular assertion, as shown in Listing 9-7.

> 但代码清单 9-2 呢？似乎不太可能轻松合并输出是 XML 以及它包含某些子字符串的断言。然而，我们可以将测试拆分为两个独立的测试，每个都有自己特定的断言，如代码清单 9-7 所示。

Listing 9-7 SerializedPageResponderTest.java (Single Assert)

代码清单 9-7 SerializedPageResponderTest.java（单一断言）
```java
   public void testGetPageHierarchyAsXml() throws Exception {
       givenPages("PageOne", "PageOne.ChildOne", "PageTwo");
 
       whenRequestIsIssued("root", "type:pages");
 
       thenResponseShouldBeXML();
   }
   public void testGetPageHierarchyHasRightTags() throws Exception {
       givenPages("PageOne", "PageOne.ChildOne", "PageTwo");
 
       whenRequestIsIssued("root", "type:pages");
 
       thenResponseShouldContain(
         "<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>"
       );
   }
```

Notice that I have changed the names of the functions to use the common given-when-then5 convention. This makes the tests even easier to read. Unfortunately, splitting the tests as shown results in a lot of duplicate code.

> 注意，我已将函数名称改为常见的 given-when-then[5] 约定。这使测试更容易阅读。不幸的是，如所示拆分测试会产生大量重复代码。

5. [RSpec].

> [5] [RSpec]。

We can eliminate the duplication by using the TEMPLATE METHOD6 pattern and putting the given/when parts in the base class, and the then parts in different derivatives. Or we could create a completely separate test class and put the given and when parts in the @Before function, and the when parts in each @Test function. But this seems like too much mechanism for such a minor issue. In the end, I prefer the multiple asserts in Listing 9-2.

> 我们可以通过使用模板方法（TEMPLATE METHOD）[6]模式来消除重复，将 given/when 部分放在基类中，将 then 部分放在不同的派生类中。或者我们可以创建一个完全独立的测试类，将 given 和 when 部分放在 @Before 函数中，将 when 部分放在每个 @Test 函数中。但这对于如此小的问题来说似乎太过复杂了。最终，我更喜欢代码清单 9-2 中的多个断言。

6. [GOF].

> [6] [GOF]。

I think the single assert rule is a good guideline.7 I usually try to create a domain-specific testing language that supports it, as in Listing 9-5. But I am not afraid to put more than one assert in a test. I think the best thing we can say is that the number of asserts in a test ought to be minimized.

> 我认为单一断言规则是一个好的指导原则。[7] 我通常会尝试创建一个支持它的领域特定测试语言，如代码清单 9-5 所示。但我不害怕在一个测试中放多个断言。我认为最好的说法是，测试中的断言数量应该最小化。

7. "Keep to the code!"

> [7] "遵守代码！"

Single Concept per Test 每个测试一个概念

Perhaps a better rule is that we want to test a single concept in each test function. We don't want long test functions that go testing one miscellaneous thing after another. Listing 9-8 is an example of such a test. This test should be split up into three independent tests because it tests three independent things. Merging them all together into the same function forces the reader to figure out why each section is there and what is being tested by that section.

> 也许更好的规则是，我们希望在每个测试函数中测试一个概念。我们不想要冗长的测试函数一个接一个地测试各种杂项。代码清单 9-8 就是这样一个测试的例子。这个测试应该被拆分为三个独立的测试，因为它测试了三个独立的事情。将它们全部合并到同一个函数中迫使读者弄清楚每个部分为什么存在以及该部分正在测试什么。

Listing 9-8

代码清单 9-8
```java
   /**
   * Miscellaneous tests for the addMonths() method.
   */
   public void testAddMonths() {
       SerialDate d1 = SerialDate.createInstance(31, 5, 2004);
 
       SerialDate d2 = SerialDate.addMonths(1, d1);
       assertEquals(30, d2.getDayOfMonth());
       assertEquals(6, d2.getMonth());
       assertEquals(2004, d2.getYYYY());
 
       SerialDate d3 = SerialDate.addMonths(2, d1);
       assertEquals(31, d3.getDayOfMonth());
       assertEquals(7, d3.getMonth());
       assertEquals(2004, d3.getYYYY());
 
       SerialDate d4 = SerialDate.addMonths(1, SerialDate.addMonths(1, d1));
       assertEquals(30, d4.getDayOfMonth());
       assertEquals(7, d4.getMonth());
       assertEquals(2004, d4.getYYYY());
 
   }
```

The three test functions probably ought to be like this:

> 这三个测试函数可能应该是这样的：

- Given the last day of a month with 31 days (like May):

> - 给定一个有 31 天的月份的最后一天（如五月）：

1. When you add one month, such that the last day of that month is the 30th (like June), then the date should be the 30th of that month, not the 31st.

> 1. 当你添加一个月，使得该月的最后一天是 30 号（如六月），那么日期应该是该月的 30 号，而不是 31 号。

2. When you add two months to that date, such that the final month has 31 days, then the date should be the 31st.

> 2. 当你向该日期添加两个月，使得最后一个月有 31 天，那么日期应该是 31 号。

- Given the last day of a month with 30 days in it (like June):

> - 给定一个有 30 天的月份的最后一天（如六月）：

1. When you add one month such that the last day of that month has 31 days, then the date should be the 30th, not the 31st.

> 1. 当你添加一个月，使得该月的最后一天有 31 天，那么日期应该是 30 号，而不是 31 号。

Stated like this, you can see that there is a general rule hiding amidst the miscellaneous tests. When you increment the month, the date can be no greater than the last day of the month. This implies that incrementing the month on February 28th should yield March 28th. That test is missing and would be a useful test to write.

> 这样说来，你可以看到在这些杂项测试中隐藏着一个一般规则。当你递增月份时，日期不能大于该月的最后一天。这意味着在 2 月 28 日递增月份应该得到 3 月 28 日。那个测试缺失了，写出来会很有用。

So it's not the multiple asserts in each section of Listing 9-8 that causes the problem. Rather it is the fact that there is more than one concept being tested. So probably the best rule is that you should minimize the number of asserts per concept and test just one concept per test function.

> 所以问题不在于代码清单 9-8 每个部分中的多个断言。而是因为有多个概念被测试。所以最好的规则可能是你应该最小化每个概念的断言数量，每个测试函数只测试一个概念。

## 9.5 F.I.R.S.T. F.I.R.S.T. 原则

8. Object Mentor Training Materials.

> [8] Object Mentor 培训材料。

Clean tests follow five other rules that form the above acronym:

> 整洁的测试遵循另外五条规则，它们组成了上述首字母缩写：

Fast Tests should be fast. They should run quickly. When tests run slow, you won't want to run them frequently. If you don't run them frequently, you won't find problems early enough to fix them easily. You won't feel as free to clean up the code. Eventually the code will begin to rot.

> 快速（Fast）测试应该快速运行。当测试运行缓慢时，你不会想频繁运行它们。如果你不频繁运行它们，你就不会及早发现问题以便轻松修复。你也不会觉得可以自由地清理代码。最终代码将开始腐烂。

Independent Tests should not depend on each other. One test should not set up the conditions for the next test. You should be able to run each test independently and run the tests in any order you like. When tests depend on each other, then the first one to fail causes a cascade of downstream failures, making diagnosis difficult and hiding downstream defects.

> 独立（Independent）测试不应相互依赖。一个测试不应为下一个测试设置条件。你应该能够独立运行每个测试，并以任何你喜欢的顺序运行测试。当测试相互依赖时，第一个失败的测试会导致一连串的下游失败，使诊断变得困难并隐藏下游缺陷。

Repeatable Tests should be repeatable in any environment. You should be able to run the tests in the production environment, in the QA environment, and on your laptop while riding home on the train without a network. If your tests aren't repeatable in any environment, then you'll always have an excuse for why they fail. You'll also find yourself unable to run the tests when the environment isn't available.

> 可重复（Repeatable）测试应该在任何环境中可重复。你应该能够在生产环境、QA 环境以及在没有网络的情况下在回家的火车上的笔记本电脑上运行测试。如果你的测试不能在任何环境中重复，那么你总会有一个失败的借口。你也会发现当环境不可用时无法运行测试。

Self-Validating The tests should have a boolean output. Either they pass or fail. You should not have to read through a log file to tell whether the tests pass. You should not have to manually compare two different text files to see whether the tests pass. If the tests aren't self-validating, then failure can become subjective and running the tests can require a long manual evaluation.

> 自验证（Self-Validating）测试应该有布尔输出。要么通过，要么失败。你不应该需要阅读日志文件来判断测试是否通过。你不应该需要手动比较两个不同的文本文件来看测试是否通过。如果测试不是自验证的，那么失败可能变成主观的，运行测试可能需要长时间的手动评估。

Timely The tests need to be written in a timely fashion. Unit tests should be written just before the production code that makes them pass. If you write tests after the production code, then you may find the production code to be hard to test. You may decide that some production code is too hard to test. You may not design the production code to be testable.

> 及时（Timely）测试需要及时编写。单元测试应该在使它们通过的生产代码之前编写。如果你在生产代码之后编写测试，你可能会发现生产代码很难测试。你可能会认为某些生产代码太难测试了。你可能不会将生产代码设计为可测试的。

## 9.6 CONCLUSION 结论

We have barely scratched the surface of this topic. Indeed, I think an entire book could be written about clean tests. Tests are as important to the health of a project as the production code is. Perhaps they are even more important, because tests preserve and enhance the flexibility, maintainability, and reusability of the production code. So keep your tests constantly clean. Work to make them expressive and succinct. Invent testing APIs that act as domain-specific language that helps you write the tests.

> 我们只是触及了这个主题的表面。事实上，我认为可以写一整本关于整洁测试的书。测试对项目的健康与生产代码同等重要。也许它们甚至更重要，因为测试保护并增强了生产代码的灵活性、可维护性和可复用性。所以持续保持测试整洁。努力使它们具有表达力和简洁性。发明充当领域特定语言的测试 API 来帮助你编写测试。

If you let the tests rot, then your code will rot too. Keep your tests clean.

> 如果你让测试腐烂，你的代码也会腐烂。保持测试整洁。
