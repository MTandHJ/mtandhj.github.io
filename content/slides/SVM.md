---
date: "2026-10-07"
draft: false
title: "SVM"
author: MTandHJ
tags:
    - Slide
    - SVM
---

<!-- --------------------------------------------------------- -->

<slide-section>
## 支持向量机<br>(Support Vector Machine, SVM)

Note:
1. 说明课题: SVM, 本节聚焦线性可分的硬间隔场景.
2. 明确目标: 理解最大间隔的选择标准, 能辨认支持向量.
3. 引出主问题: 能分开两类样本的直线很多, 如何选择最优的一条?

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>
## 支持向量机

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261009112425.png" size="100%"></slide-img>

<slide-ref>
Vladimir Vapnik: 统计学习理论与 SVM 的主要奠基人
Larry Jackel: 贝尔实验室自适应系统研究部门的负责人
Yann LeCun: 深度学习三巨头之一
</slide-ref>

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## 分类问题

- 根据属性特征区分 ($\textcolor{green}{\bullet}$, $\textcolor{purple}{\times}$):
    - **垃圾邮件分类:** 正常邮件 ($\textcolor{green}{\bullet}$) & 垃圾邮件 ($\textcolor{purple}{\times}$)

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/SVM_email.png" size="100%"></slide-img>

Note:
1. 以垃圾邮件识别引入二分类: 正常邮件与垃圾邮件.
2. 说明二维特征表示: 推广词数量与超链接数量, 每封邮件对应一个点.
3. 对照图例辨认两类样本, 本图采用理想化的线性可分数据, 真实邮件未必如此.
4. 引出线性分隔: 二维用直线, 更高维用超平面.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 分类问题: 线性可分

<slide-highlight>
分隔 ① ② ③ 孰优孰劣?
</slide-highlight>

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/SVM_123.png" size="100%"></slide-img>

Note:
1. 确认三种方案都能正确分隔两类样本.
2. 提问并短暂停顿: 仅根据分类正确与否, 能否区分方案优劣?
3. 指出需要额外的选择标准, 暂不揭示答案.
4. 过渡到狐兔情境, 用活动空间建立直觉.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 狐兔分隔问题

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261007192415.png" size="90%"></slide-img>

Note:
1. 建立对应: 样本点是固定巢穴, 两类标签是狐兔, 分隔直线是笔直栅栏.
2. 说明约束: 两类巢穴位于栅栏两侧, 活动范围不能越过栅栏.
3. 说明活动模型: 以巢穴为中心的圆, 用半径衡量活动空间.
4. 明确目标: 最大化共同保证的活动半径, 即最大化最小活动半径.
5. 提问: 怎样让最受限制的动物也获得更大的活动空间?

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## 狐兔分隔问题: 如何规划出更大的活动半径?

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261008151300.png" size="100%"></slide-img>

- $② > ①/③$: 分隔 ② 提供更大的**最小**活动半径
- **最优线性分隔:** 最大化狐兔最小活动半径

<div  class="fragment" data-fragment-index="0">
<slide-highlight>
如何确定最优线性分隔?
</slide-highlight>
</div>

Note:
1. 对固定栅栏, 单个巢穴允许的最大活动半径等于它到栅栏的垂直距离.
2. 比较每种方案中最近的巢穴, 以最小距离作为共同活动半径.
3. 得出图中方案 ② 优于 ① 和 ③, 比较最小值, 而非平均距离或最大距离.
4. 随片段出现引出下一问题: 如何确定最优栅栏的位置和方向?

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 狐兔分隔问题

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/SVM_dd1.png" size="90%"></slide-img>

Note:
1. 固定栅栏方向, 分别找出两侧最近的巢穴.
2. 解释两侧最小距离的记号, 距离均按垂直方向测量.
3. 两侧距离不等时, 共同活动半径由较小的一侧决定.
4. 引导平移: 向距离较大的一侧移动, 较小距离增大, 较大距离减小.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 狐兔分隔问题

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/SVM_dd2.png" size="90%"></slide-img>


- **观察一: 最优分隔保证相等的最小活动半径**

    $$
    \min_{i \in \{\text{rabbit}\}} d_i^+ = \min_{j \in \{\text{fox}\}} d_j^-
    $$

Note:
1. 对照平移前后: 两侧最小距离相等时, 该固定方向下的共同活动半径最大.
2. 解释公式: 分别在两类巢穴中取最小距离, 再使两个最小值相等.
3. 强调相等只是全局最优解的必要条件, 还不能确定最优方向.
4. 过渡: 除了平移, 还需要比较不同方向能够达到的共同活动半径.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 狐兔分隔问题

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261008165247.png" size="100%"></slide-img>

Note:
1. 从位置调整转向方向比较, 给所有巢穴设置相同的较小活动半径.
2. 候选栅栏必须避开所有活动圆, 并将两类巢穴分在两侧.
3. 蓝色区域表示候选栅栏位置的示意, 栅栏本身仍是一条直线.
4. 观察小半径时存在多种可行方向和位置, 准备扩大活动圆.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 狐兔分隔问题

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261008165408.png" size="100%"></slide-img>

Note:
1. 保持同一组巢穴, 增大共同活动半径.
2. 对照观察哪些候选栅栏无法避开活动圆, 因而失去可行性.
3. 可行方案随半径增大而减少, 同类活动圆重叠不影响狐兔分隔约束.
4. 追问: 共同活动半径还能增大到什么程度?

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 狐兔分隔问题

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261008165524.png" size="100%"></slide-img>

Note:
1. 对照前两页, 展示活动半径继续增大后的极限分隔示意.
2. 指出与栅栏相切的活动圆, 它们限制共同半径继续增大.
3. 其余巢穴离栅栏更远, 不构成当前最小距离的约束.
4. 归纳目标: 在可行分隔中最大化最小垂直距离.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 狐兔分隔问题

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261008165524.png" size="100%"></slide-img>

- **观察二:** 逐步增加活动半径, 可设置<span style="color:blue">栅栏区域</span>逐步缩减
- **观察三:** 逐步增加活动半径, 真正决定最优分隔的"🦊、🐰" 逐步减少

Note:
1. 回顾三个阶段: 共同活动半径增大, 满足要求的候选分隔方案减少.
2. 澄清蓝色区域是候选位置示意, 不代表栅栏具有宽度.
3. 本例的关注点集中到最近的巢穴, 不将动物数量逐步减少表述为一般规律.
4. 所有样本仍需满足分隔约束, 最优方案的边界样本限制间隔大小.
5. 引出关键边界样本的名称: 支持向量.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 支持向量机: 最优分隔

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261008171625.png" size="80%"></slide-img>

Note:
1. 先辨认实线最优分隔与两侧平行虚线, 虚线为间隔边界.
2. 定义支持向量: 硬间隔场景中位于间隔边界上的样本, 对照图中一个狐狸巢穴和两个兔子巢穴.
3. 区分单侧与总宽度: 共同活动半径为 γ, 两条间隔边界之间的宽度为 2γ.
4. 两种度量对应相同的最优方案, 距离均沿垂直于分隔线的方向测量.
5. 对应回分类任务: 正确分隔两类样本, 并最大化最小几何间隔.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 课堂小结

<slide-highlight>
相等间隔 -> 支持向量 -> 最优分隔
</slide-highlight>

- **课后思考:** 新增 "🦊、🐰" 最优分隔是否改变. 请给出 "发生改变" 和 "保持不变的例子".

- **课后练习:** 🐰巢穴的位置为: $(1,1), (1,3),(3,1),(0,2)$; 🦊巢穴的位置为: $(4,4),(3,5),(5,5),(6,4)$;
    1. 在坐标系中标出所有巢穴, 画出使最小活动半径最大的栅栏;
    2. 标出两侧间隔边界, 写出栅栏及两侧间隔边界的直线方程;
    3. 求能够共同保证的最大活动半径;
    4. 指出所有支持向量, 并说明判断依据.

Note:
1. 回顾选择标准: 正确分隔两类样本, 并最大化最小垂直距离.
2. 回顾推理: 固定方向时平衡两侧距离, 再比较方向, 最后辨认支持向量.
3. 提醒两侧距离相等不足以证明全局最优, 支持向量位于间隔边界而非分隔线上.
4. 布置思考: 新增巢穴后栅栏和间隔可能改变或不变, 假设新增后仍线性可分.
5. 布置练习: 依次完成描点, 分隔与间隔边界, 半径计算, 支持向量辨认, 不公布答案.

</slide-section>

<!-- --------------------------------------------------------- -->